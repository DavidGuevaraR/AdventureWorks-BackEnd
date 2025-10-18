import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum UserRole {
  ADMIN = 'ADMIN',
  SALES = 'SALES'
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  nombre!: string;

  @Prop({ required: true, unique: true })
  dui!: string;

  @Prop({ required: true, unique: true, lowercase: true })
  email!: string;

  @Prop({ required: true })
  passwordHash!: string;

  @Prop({ required: true, enum: UserRole, default: UserRole.SALES })
  role!: UserRole;

  @Prop({ default: true })
  is_active!: boolean;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
