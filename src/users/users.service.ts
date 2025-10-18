import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const passwordHash = await bcrypt.hash(createUserDto.password, 10);
    const createdUser = new this.userModel({
      ...createUserDto,
      passwordHash
    });
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().lean();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).lean();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).lean();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updateData: Partial<User> & { passwordHash?: string } = { ...updateUserDto };
    if (updateUserDto.password) {
      updateData.passwordHash = await bcrypt.hash(updateUserDto.password, 10);
      delete (updateData as any).password;
    }
    const user = await this.userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .lean();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async softDelete(id: string): Promise<User> {
    const user = await this.userModel
      .findByIdAndUpdate(id, { is_active: false }, { new: true })
      .lean();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
