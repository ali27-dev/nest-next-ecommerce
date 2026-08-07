import {
  IsUUID,
  IsEnum,
  // IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { PaymentMethod } from '@prisma/client';

export class CreatePaymentDto {
  @IsUUID('4')
  orderId: string;

  @IsEnum(PaymentMethod, {
    message: 'paymentMethod must be COD, EASY_PAISA, or BANK_TRANSFER',
  })
  paymentMethod: PaymentMethod;

  @ValidateIf((o) => o.paymentMethod !== PaymentMethod.COD)
  @IsString()
  transactionId?: string;
}
