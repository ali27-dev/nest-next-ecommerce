import { Module } from '@nestjs/common';
import { FabricsService } from './fabrics.service';
import { FabricsController } from './fabrics.controller';

@Module({
  controllers: [FabricsController],
  providers: [FabricsService],
})
export class FabricsModule {}
