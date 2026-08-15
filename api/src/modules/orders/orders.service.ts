import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async checkout(userId: string, dto: CreateOrderDto) {
    const cart = await this.prisma.cart.findFirst({
      where: { userId, checkedOut: false },
      include: { cartItems: { include: { product: true } } },
    });

    if (!cart || cart.cartItems.length === 0) {
      throw new BadRequestException('Your cart is empty');
    }

    // Re-validate stock right before committing — it may have changed since items were added
    for (const item of cart.cartItems) {
      if (!item.product.isActive) {
        throw new BadRequestException(
          `${item.product.name} is no longer available`,
        );
      }
      if (item.product.stock < item.quantity) {
        throw new BadRequestException(
          `Not enough stock for ${item.product.name}`,
        );
      }
    }

    const totalAmount = cart.cartItems.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0,
    );

    // Everything below must succeed or fail together
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId,
          cartId: cart.id,
          status: OrderStatus.PENDING,
          totalAmount,
          shippingAddress: dto.shippingAddress,
          orderItems: {
            create: cart.cartItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price, // snapshot price at time of purchase
            })),
          },
        },
        include: { orderItems: { include: { product: true } } },
      });

      // Decrement stock for each purchased product
      for (const item of cart.cartItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // Mark this cart as checked out — user gets a fresh cart next time
      await tx.cart.update({
        where: { id: cart.id },
        data: { checkedOut: true },
      });

      return order;
    });
  }

  async findAll(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { orderItems: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const order = await this.prisma.order.findFirst({
      where: { id, userId },
      include: { orderItems: { include: { product: true } }, payment: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async cancel(userId: string, id: string) {
    const order = await this.findOne(userId, id);

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Only pending orders can be cancelled');
    }

    return this.prisma.$transaction(async (tx) => {
      // Restore stock since the order never shipped
      for (const item of order.orderItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }

      return tx.order.update({
        where: { id },
        data: { status: OrderStatus.CANCELLED },
      });
    });
  }

  // Admin \\
  async findAllAdmin() {
    return this.prisma.order.findMany({
      include: {
        orderItems: { include: { product: true } },
        payment: true,
        user: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
