import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  ParseUUIDPipe,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { GetUser } from 'src/common/get-user.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from '@prisma/client';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('checkout')
  checkout(@GetUser('id') userId: string, @Body() dto: CreateOrderDto) {
    return this.ordersService.checkout(userId, dto);
  }

  @Get()
  findAll(@GetUser('id') userId: string) {
    return this.ordersService.findAll(userId);
  }

  @Get('admin/all')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  findAllAdmin() {
    return this.ordersService.findAllAdmin();
  }

  @Delete('admin/:id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  removeAdmin(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersService.removeAdmin(id);
  }

  @Patch(':id/confirm-delivery')
  confirmDelivery(
    @GetUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.ordersService.confirmDelivery(userId, id);
  }

  @Get(':id')
  findOne(
    @GetUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.ordersService.findOne(userId, id);
  }

  @Patch(':id/cancel')
  cancel(
    @GetUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.ordersService.cancel(userId, id);
  }
}
