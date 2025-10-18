import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  nombre!: string;

  @Prop({ required: true, unique: true })
  codigo_producto!: string;

  @Prop({ required: true, min: 0 })
  precio!: number;

  @Prop({ default: true })
  is_active!: boolean;
}

export type ProductDocument = Product & Document;

export const ProductSchema = SchemaFactory.createForClass(Product);
