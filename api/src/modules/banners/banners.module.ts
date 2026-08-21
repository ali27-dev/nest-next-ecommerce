import { Module } from '@nestjs/common';
import { BannersService } from './banners.service';
import { BannersController } from './banners.controller';
import { CloudinaryModule } from 'src/config/cloudinary.module';

@Module({
  imports: [CloudinaryModule],
  controllers: [BannersController],
  providers: [BannersService],
})
export class BannersModule {}
