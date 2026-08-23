import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { SupportService } from './support.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role, TicketStatus } from '@prisma/client';
import { GetUser } from 'src/common/get-user.decorator';
import { UpdateTicketStatusDto } from './dto/update-ticket.dto';

@Controller('support')
@UseGuards(JwtAuthGuard)
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Post()
  create(@GetUser('id') userId: string, @Body() dto: CreateTicketDto) {
    return this.supportService.create(userId, dto);
  }

  @Get()
  findAll(@GetUser('id') userId: string) {
    return this.supportService.findAll(userId);
  }

  @Get('admin/all')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  findAllAdmin(@Query('status') status?: TicketStatus) {
    return this.supportService.findAllAdmin(status);
  }

  @Get('admin/:id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  findOneAdmin(@Param('id', ParseUUIDPipe) id: string) {
    return this.supportService.findOneAdmin(id);
  }

  @Post('admin/:id/messages')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  addMessageAdmin(
    @GetUser('id') adminId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateMessageDto,
  ) {
    return this.supportService.addMessage(adminId, id, dto, true);
  }

  @Patch('admin/:id/status')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTicketStatusDto,
  ) {
    return this.supportService.updateStatus(id, dto.status);
  }

  @Get(':id')
  findOne(
    @GetUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.supportService.findOne(userId, id);
  }

  @Post(':id/messages')
  addMessage(
    @GetUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateMessageDto,
  ) {
    return this.supportService.addMessage(userId, id, dto, false);
  }
}
