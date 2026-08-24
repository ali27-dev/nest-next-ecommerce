import { IsBoolean, IsString, ValidateIf } from 'class-validator';

export class VerifyPaymentDto {
  @IsBoolean()
  approve: boolean;

  @ValidateIf((dto: VerifyPaymentDto) => !dto.approve)
  @IsString()
  reason?: string;
}
