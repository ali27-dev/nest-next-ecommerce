import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { TicketStatus } from '@prisma/client';

@Injectable()
export class SupportService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateTicketDto) {
    if (dto.orderId) {
      const order = await this.prisma.order.findFirst({
        where: { id: dto.orderId, userId },
      });
      if (!order) {
        throw new NotFoundException('Order not found');
      }
    }

    return this.prisma.supportTicket.create({
      data: {
        subject: dto.subject,
        category: dto.category,
        userId,
        orderId: dto.orderId,
        messages: {
          create: {
            message: dto.message,
            authorId: userId,
            isFromAdmin: false,
          },
        },
      },
      include: { messages: true },
    });
  }

  findAll(userId: string) {
    return this.prisma.supportTicket.findMany({
      where: { userId },
      include: {
        order: { select: { id: true, orderNumber: true } },
        messages: { orderBy: { createdAt: 'asc' }, take: 1 },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const ticket = await this.prisma.supportTicket.findFirst({
      where: { id, userId },
      include: {
        order: { select: { id: true, orderNumber: true } },
        messages: {
          orderBy: { createdAt: 'asc' },
          include: {
            author: {
              select: { firstName: true, lastName: true, email: true },
            },
          },
        },
      },
    });
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }
    return ticket;
  }

  async addMessage(
    userId: string,
    ticketId: string,
    dto: CreateMessageDto,
    isFromAdmin = false,
  ) {
    const ticket = isFromAdmin
      ? await this.prisma.supportTicket.findUnique({ where: { id: ticketId } })
      : await this.prisma.supportTicket.findFirst({
          where: { id: ticketId, userId },
        });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    await this.prisma.supportMessage.create({
      data: { message: dto.message, ticketId, authorId: userId, isFromAdmin },
    });

    // Reopen a resolved/closed ticket if the customer replies again
    if (
      !isFromAdmin &&
      (ticket.status === 'RESOLVED' || ticket.status === 'CLOSED')
    ) {
      await this.prisma.supportTicket.update({
        where: { id: ticketId },
        data: { status: TicketStatus.OPEN },
      });
    } else {
      await this.prisma.supportTicket.update({
        where: { id: ticketId },
        data: { updatedAt: new Date() },
      });
    }

    return this.findOneAny(ticketId);
  }

  // Admin
  findAllAdmin(status?: TicketStatus) {
    return this.prisma.supportTicket.findMany({
      where: status ? { status } : {},
      include: {
        user: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
        order: { select: { id: true, orderNumber: true } },
        messages: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOneAdmin(id: string) {
    const ticket = await this.prisma.supportTicket.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
        order: { select: { id: true, orderNumber: true } },
        messages: {
          orderBy: { createdAt: 'asc' },
          include: {
            author: {
              select: { firstName: true, lastName: true, email: true },
            },
          },
        },
      },
    });
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }
    return ticket;
  }

  async updateStatus(id: string, status: TicketStatus) {
    const ticket = await this.prisma.supportTicket.findUnique({
      where: { id },
    });
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }
    return this.prisma.supportTicket.update({
      where: { id },
      data: { status },
    });
  }

  private findOneAny(id: string) {
    return this.prisma.supportTicket.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          include: {
            author: {
              select: { firstName: true, lastName: true, email: true },
            },
          },
        },
      },
    });
  }
}
