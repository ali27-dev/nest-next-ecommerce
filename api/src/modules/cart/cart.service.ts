import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  // Get or create the user's active (not-checked-out) cart
  private async getOrCreateCart(userId: string) {
    let cart = await this.prisma.cart.findFirst({
      where: { userId, checkedOut: false },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({ data: { userId } });
    }

    return cart;
  }

  async getCart(userId: string) {
    const cart = await this.getOrCreateCart(userId);

    return this.prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        cartItems: { include: { product: true } },
      },
    });
  }

  async addItem(userId: string, dto: AddCartItemDto) {
    const cart = await this.getOrCreateCart(userId);

    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
    });
    if (!product || !product.isActive) {
      throw new NotFoundException('Product not found');
    }
    if (product.stock < dto.quantity) {
      throw new BadRequestException('Not enough stock available');
    }

    const existingItem = await this.prisma.cartItem.findUnique({
      where: {
        cartId_productId_size: {
          cartId: cart.id,
          productId: dto.productId,
          size: dto.size ?? '',
        },
      },
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + dto.quantity;
      if (product.stock < newQuantity) {
        throw new BadRequestException('Not enough stock available');
      }
      return this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      });
    }

    return this.prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: dto.productId,
        quantity: dto.quantity,
        size: dto.size ?? '',
      },
    });
  }

  async updateItem(userId: string, itemId: string, dto: UpdateCartItemDto) {
    const cart = await this.getOrCreateCart(userId);

    const item = await this.prisma.cartItem.findFirst({
      where: { id: itemId, cartId: cart.id },
      include: { product: true },
    });
    if (!item) {
      throw new NotFoundException('Cart item not found');
    }
    if (item.product.stock < dto.quantity) {
      throw new BadRequestException('Not enough stock available');
    }

    return this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: dto.quantity },
    });
  }

  async removeItem(userId: string, itemId: string) {
    const cart = await this.getOrCreateCart(userId);

    const item = await this.prisma.cartItem.findFirst({
      where: { id: itemId, cartId: cart.id },
    });
    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    return this.prisma.cartItem.delete({ where: { id: itemId } });
  }
}
