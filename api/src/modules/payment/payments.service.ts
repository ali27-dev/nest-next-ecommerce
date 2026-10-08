import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { OrderStatus, PaymentStatus } from '@prisma/client';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreatePaymentDto) {
    const order = await this.prisma.order.findFirst({
      where: { id: dto.orderId, userId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status === OrderStatus.CANCELLED) {
      throw new BadRequestException('This order has been cancelled');
    }

    const existingPayment = await this.prisma.payment.findUnique({
      where: { orderId: dto.orderId },
    });

    // A rejected payment (order is FAILED) may be resubmitted with a new
    // reference. Any other existing payment blocks a second one.
    const isRetry =
      existingPayment?.status === PaymentStatus.FAILED &&
      order.status === OrderStatus.FAILED;

    if (existingPayment && !isRetry) {
      throw new BadRequestException('A payment already exists for this order');
    }

    const transactionId =
      dto.paymentMethod === 'COD' ? undefined : dto.transactionId;

    // The same reference must not be used to "pay" for two different orders
    if (transactionId) {
      const duplicate = await this.prisma.payment.findFirst({
        where: {
          transactionId: { equals: transactionId, mode: 'insensitive' },
          status: { not: PaymentStatus.FAILED },
          ...(existingPayment && { id: { not: existingPayment.id } }),
        },
      });
      if (duplicate) {
        throw new ConflictException(
          'This transaction ID has already been used. Please check it and try again.',
        );
      }
    }

    // COD needs no proof and no admin verification — mark it pending until delivery
    // EasyPaisa/bank transfer sit as PENDING until an admin verifies the transactionId
    if (existingPayment && isRetry) {
      return this.prisma.$transaction(async (tx) => {
        const payment = await tx.payment.update({
          where: { id: existingPayment.id },
          data: {
            paymentMethod: dto.paymentMethod,
            transactionId,
            status: PaymentStatus.PENDING,
            rejectionReason: null,
          },
        });
        await tx.order.update({
          where: { id: order.id },
          data: { status: OrderStatus.PENDING },
        });
        return payment;
      });
    }

    return this.prisma.payment.create({
      data: {
        orderId: dto.orderId,
        userId,
        amount: order.totalAmount,
        paymentMethod: dto.paymentMethod,
        transactionId,
        status: PaymentStatus.PENDING,
      },
    });
  }

  async findOne(userId: string, id: string) {
    const payment = await this.prisma.payment.findFirst({
      where: { id, userId },
      include: { order: true },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  // Admin-only — list all payments awaiting manual verification
  findPending() {
    return this.prisma.payment.findMany({
      where: { status: PaymentStatus.PENDING, paymentMethod: { not: 'COD' } },
      include: { order: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  // Admin-only — approve or reject a manual payment
  async verify(id: string, approve: boolean, reason?: string) {
    const payment = await this.prisma.payment.findUnique({ where: { id } });
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }
    if (payment.status !== PaymentStatus.PENDING) {
      throw new BadRequestException('This payment has already been processed');
    }
    if (!approve && !reason?.trim()) {
      throw new BadRequestException('A reason is required to reject a payment');
    }

    return this.prisma.$transaction(async (tx) => {
      const updatedPayment = await tx.payment.update({
        where: { id },
        data: {
          status: approve ? PaymentStatus.COMPLETE : PaymentStatus.FAILED,
          rejectionReason: approve ? null : reason,
        },
      });

      await tx.order.update({
        where: { id: payment.orderId },
        data: { status: approve ? OrderStatus.PROCESSING : OrderStatus.FAILED },
      });

      return updatedPayment;
    });
  }
}
