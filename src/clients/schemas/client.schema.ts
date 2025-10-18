import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ClientDocument = Client & Document;

@Schema({ timestamps: true })
export class Client {
  @Prop({ type: String, required: true })
  nombre!: string;

  @Prop({ type: String, required: true })
  correo!: string;

  @Prop({ type: String, required: true })
  municipio!: string;

  @Prop({ type: String, required: true })
  departamento!: string;

  @Prop({ type: String, required: true })
  complementario!: string;

  // Opcionales
  @Prop({ type: String, required: false })
  tipoDocumento?: string;

  @Prop({ type: String, required: false })
  numDocumento?: string;

  @Prop({ type: String, required: false })
  nrc?: string;

  @Prop({ type: String, required: false })
  codActividad?: string;

  @Prop({ type: String, required: false })
  descActividad?: string;

  @Prop({ type: Boolean, default: true })
  is_active!: boolean;
}

export const ClientSchema = SchemaFactory.createForClass(Client);
