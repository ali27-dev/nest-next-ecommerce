import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class CreateFabricDto {
  @IsString()
  @IsNotEmpty({ message: 'Fabric name is required' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Slug is required' })
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      'Slug must be lowercase, alphanumeric, and hyphen-separated (e.g. "raw-silk")',
  })
  slug: string;
}
