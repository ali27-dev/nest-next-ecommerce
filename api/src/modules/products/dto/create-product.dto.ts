import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsUUID,
  IsOptional,
  IsUrl,
  IsBoolean,
} from 'class-validator';
  IsEnum,
  IsArray,
} from 'class-validator';
import { Season, PieceCount, StitchType } from '@prisma/client';
} from 'class-validator';
import { Season, PieceCount } from '@prisma/client';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'Product name is required' })
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Price must have at most 2 decimal places' },
  )
  @Min(0, { message: 'Price cannot be negative' })
  price: number;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Compare-at price must have at most 2 decimal places' },
  )
  @Min(0, { message: 'Compare-at price cannot be negative' })
  compareAtPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Stock cannot be negative' })
  stock?: number;

  @IsString()
  @IsNotEmpty({ message: 'SKU is required' })
  sku: string;

  @IsOptional()
  @IsUrl({}, { message: 'Image URL must be a valid URL' })
  imageUrl?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Secondary image URL must be a valid URL' })
  secondaryImageUrl?: string;

  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true, message: 'Each gallery image must be a valid URL' })
  galleryImages?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  sizes?: string[];

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsUUID('4', { message: 'categoryId must be a valid UUID' })
  categoryId: string;

  @IsOptional()
  @IsUUID('4', { message: 'fabricId must be a valid UUID' })
  fabricId?: string;

  @IsOptional()
  @IsEnum(Season, { message: 'season must be SUMMER, WINTER, or ALL_SEASON' })
  season?: Season;

  @IsOptional()
  @IsEnum(PieceCount, {
    message: 'pieceCount must be ONE_PIECE, TWO_PIECE, or THREE_PIECE',
  })
  pieceCount?: PieceCount;

  @IsOptional()
  @IsEnum(StitchType, { message: 'stitchType must be STITCHED or UNSTITCHED' })
  stitchType?: StitchType;
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Compare-at price must have at most 2 decimal places' },
  )
  @Min(0, { message: 'Compare-at price cannot be negative' })
  compareAtPrice?: number;
}
