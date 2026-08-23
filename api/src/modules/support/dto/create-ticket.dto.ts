import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { TicketCategory } from '@prisma/client';

export class CreateTicketDto {
  @IsString()
  @IsNotEmpty({ message: 'Subject is required' })
  subject: string;

  @IsEnum(TicketCategory, {
    message: 'category must be PRODUCT, DELIVERY, PAYMENT, or OTHER',
  })
  category: TicketCategory;

  @IsString()
  @IsNotEmpty({ message: 'Message is required' })
  message: string;

  @IsOptional()
  @IsUUID('4', { message: 'orderId must be a valid UUID' })
  orderId?: string;
}
