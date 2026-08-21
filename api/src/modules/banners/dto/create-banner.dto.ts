import {
  IsString,
  IsOptional,
  IsUrl,
  IsInt,
  IsBoolean,
  IsUUID,
} from 'class-validator';

export class CreateBannerDto {
  @IsUrl({}, { message: 'imageUrl must be a valid URL' })
  imageUrl: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  linkUrl?: string;

  @IsOptional()
  @IsInt()
  order?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsUUID('4', { message: 'categoryId must be a valid UUID' })
  categoryId?: string;
}
