import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Prisma, Season, PieceCount } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    const existingSku = await this.prisma.product.findUnique({
      where: { sku: createProductDto.sku },
    });
    if (existingSku) {
      throw new ConflictException('A product with this SKU already exists');
    }

    const category = await this.prisma.category.findUnique({
      where: { id: createProductDto.categoryId },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (createProductDto.fabricId) {
      const fabric = await this.prisma.fabric.findUnique({
        where: { id: createProductDto.fabricId },
      });
      if (!fabric) {
        throw new NotFoundException('Fabric not found');
      }
    }

    return this.prisma.product.create({
      data: createProductDto,
    });
  }

  // Pagination Logic \\
  async findAll(params: {
    page?: number;
    limit?: number;
    categoryId?: string;
    fabricId?: string;
    season?: Season;
    pieceCount?: PieceCount;
    minPrice?: number;
    maxPrice?: number;
    sort?: 'price_asc' | 'price_desc' | 'newest';
  }) {
    const {
      page = 1,
      limit = 20,
      categoryId,
      fabricId,
      season,
      pieceCount,
      minPrice,
      maxPrice,
      sort = 'newest',
    } = params;

    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      isActive: true,
      ...(categoryId && { categoryId }),
      ...(fabricId && { fabricId }),
      ...(season && { season }),
      ...(pieceCount && { pieceCount }),
      ...((minPrice !== undefined || maxPrice !== undefined) && {
        price: {
          ...(minPrice !== undefined && { gte: minPrice }),
          ...(maxPrice !== undefined && { lte: maxPrice }),
        },
      }),
    };

    const orderBy: Prisma.ProductOrderByWithRelationInput =
      sort === 'price_asc'
        ? { price: 'asc' }
        : sort === 'price_desc'
          ? { price: 'desc' }
          : { createdAt: 'desc' };

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: { category: true, fabric: true },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      products,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }
  // Find One product \\
  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  // Update product \\
  async update(id: string, updateProductDto: UpdateProductDto) {
    await this.findOne(id); // throws 404 if not found

    if (updateProductDto.sku) {
      const existingSku = await this.prisma.product.findUnique({
        where: { sku: updateProductDto.sku },
      });
      if (existingSku && existingSku.id !== id) {
        throw new ConflictException('A product with this SKU already exists');
      }
    }
    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id); // throws 404 if not found

    const orderItemCount = await this.prisma.orderItem.count({
      where: { productId: id },
    });

    if (orderItemCount > 0) {
      // This product has real order history — deleting it would break past
      // orders' referential integrity. Deactivate instead, same as any real
      // e-commerce platform does for discontinued products that were ever sold.
      return this.prisma.product.update({
        where: { id },
        data: { isActive: false },
      });
    }

    return this.prisma.product.delete({ where: { id } });
  }
}
