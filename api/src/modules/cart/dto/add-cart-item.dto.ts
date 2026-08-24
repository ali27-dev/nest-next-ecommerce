import {
  IsUUID,
  IsInt,
  Min,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class AddCartItemDto {
  @IsUUID('4', { message: 'productId must be a valid UUID' })
  productId: string;

  @IsInt()
  @Min(1, { message: 'Quantity must be at least 1' })
  quantity: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  size?: string;
}
