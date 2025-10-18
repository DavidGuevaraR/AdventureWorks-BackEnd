import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private readonly productModel: Model<ProductDocument>) {}

  async create(dto: CreateProductDto): Promise<Product> {
    const created = new this.productModel(dto);
    return created.save();
  }

  async findAll(query: PaginationQueryDto) {
    const { page = 1, limit = 10, search } = query;
    const filter: FilterQuery<ProductDocument> = {};
    if (search) {
      filter.$or = [
        { nombre: { $regex: search, $options: 'i' } },
        { codigo_producto: { $regex: search, $options: 'i' } }
      ];
    }
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.productModel
        .find(filter)
        .skip(skip)
        .limit(limit)
        .lean(),
      this.productModel.countDocuments(filter)
    ]);
    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).lean();
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const product = await this.productModel
      .findByIdAndUpdate(id, dto, { new: true })
      .lean();
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async remove(id: string): Promise<Product> {
    const product = await this.productModel
      .findByIdAndUpdate(id, { is_active: false }, { new: true })
      .lean();
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }
}
