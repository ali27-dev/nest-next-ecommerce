import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFabricDto } from './dto/create-fabric.dto';
import { UpdateFabricDto } from './dto/update-fabric.dto';

@Injectable()
export class FabricsService {
  constructor(private prisma: PrismaService) {}

  async create(createFabricDto: CreateFabricDto) {
    const existingSlug = await this.prisma.fabric.findUnique({
      where: { slug: createFabricDto.slug },
    });
    if (existingSlug) {
      throw new ConflictException('A fabric with this slug already exists');
    }

    return this.prisma.fabric.create({ data: createFabricDto });
  }

  findAll() {
    return this.prisma.fabric.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const fabric = await this.prisma.fabric.findUnique({ where: { id } });
    if (!fabric) {
      throw new NotFoundException('Fabric not found');
    }
    return fabric;
  }

  async update(id: string, updateFabricDto: UpdateFabricDto) {
    await this.findOne(id);

    if (updateFabricDto.slug) {
      const existingSlug = await this.prisma.fabric.findUnique({
        where: { slug: updateFabricDto.slug },
      });
      if (existingSlug && existingSlug.id !== id) {
        throw new ConflictException('A fabric with this slug already exists');
      }
    }

    return this.prisma.fabric.update({ where: { id }, data: updateFabricDto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.fabric.delete({ where: { id } });
  }
}
