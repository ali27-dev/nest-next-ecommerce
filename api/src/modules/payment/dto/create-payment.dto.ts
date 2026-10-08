import {
  IsUUID,
  IsEnum,
  IsString,
  ValidateIf,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { PaymentMethod } from '@prisma/client';

export class CreatePaymentDto {
  @IsUUID('4')
  orderId: string;

  @IsEnum(PaymentMethod, {
    message: 'paymentMethod must be COD, EASY_PAISA, or BANK_TRANSFER',
  })
  paymentMethod: PaymentMethod;

  // Only EasyPaisa / bank transfer need proof of payment
  @ValidateIf((o: CreatePaymentDto) => o.paymentMethod !== PaymentMethod.COD)
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @MinLength(6, { message: 'Transaction ID must be at least 6 characters' })
  @MaxLength(64, { message: 'Transaction ID is too long' })
  @Matches(/^[A-Za-z0-9][A-Za-z0-9\-_/]*$/, {
    message:
      'Transaction ID can only contain letters, numbers, dashes and slashes',
  })
  transactionId?: string;
}
