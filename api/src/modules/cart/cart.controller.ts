import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  UseGuards,
  // Req,
} from '@nestjs/common';
import { Request } from 'express';
import { CartService } from './cart.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { GetUser } from 'src/common/get-user.decorator';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@GetUser('id') userId: string) {
    return this.cartService.getCart(userId);
  }

  @Post('items')
  addItem(@GetUser('id') userId: string, @Body() dto: AddCartItemDto) {
    return this.cartService.addItem(userId, dto);
  }

  @Patch('items/:id')
  updateItem(
    @GetUser('id') userId: string,
    @Param('id', ParseUUIDPipe) itemId: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartService.updateItem(userId, itemId, dto);
  }

  @Delete('items/:id')
  removeItem(
    @GetUser('id') userId: string,
    @Param('id', ParseUUIDPipe) itemId: string,
  ) {
    return this.cartService.removeItem(userId, itemId);
  }
}
