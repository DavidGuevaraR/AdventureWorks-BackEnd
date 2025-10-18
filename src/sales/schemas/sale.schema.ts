import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export enum SaleStatus {
  GENERATED = 'GENERATED',
  CANCELLED = 'CANCELLED'
}

@Schema({ timestamps: true })
export class Sale {
  @Prop({ required: true, unique: true })
  codigo_generacion!: string;

  @Prop({ type: SchemaTypes.Mixed, required: true })
  detalle_venta!: JsonValue;

  @Prop({ enum: SaleStatus, default: SaleStatus.GENERATED })
  status!: SaleStatus;

  @Prop()
  cancel_reason?: string;

  @Prop()
  cancel_date?: Date;

  @Prop()
  cancelled_by?: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export type SaleDocument = Sale & Document;

export const SaleSchema = SchemaFactory.createForClass(Sale);

SaleSchema.index({ codigo_generacion: 1 });
SaleSchema.index({ 'detalle_venta.identificacion.tipoDte': 1 });
SaleSchema.index({ createdAt: -1 });