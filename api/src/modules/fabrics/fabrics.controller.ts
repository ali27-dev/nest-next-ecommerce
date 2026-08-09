import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { FabricsService } from './fabrics.service';
import { CreateFabricDto } from './dto/create-fabric.dto';
import { UpdateFabricDto } from './dto/update-fabric.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('fabrics')
export class FabricsController {
  constructor(private readonly fabricsService: FabricsService) {}

  @Get()
  findAll() {
    return this.fabricsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.fabricsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createFabricDto: CreateFabricDto) {
    return this.fabricsService.create(createFabricDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateFabricDto: UpdateFabricDto,
  ) {
    return this.fabricsService.update(id, updateFabricDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.fabricsService.remove(id);
  }
}
