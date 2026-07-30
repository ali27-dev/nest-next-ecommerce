import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    });

    super({
      adapter,
      log:
        process.env.NODE_ENV === 'development'
          ? ['query', 'error', 'warn']
          : ['error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
    console.log('Databse connected!');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('Database disconnected!');
  }

  cleanDatabase() {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Cannot clean database in production');
    }

    return this.$transaction([
      this.payment.deleteMany(),
      this.orderItem.deleteMany(),
      this.cartItem.deleteMany(),
      this.order.deleteMany(),
      this.cart.deleteMany(),
      this.product.deleteMany(),
      this.category.deleteMany(),
      this.user.deleteMany(),
    ]);
  }
}
