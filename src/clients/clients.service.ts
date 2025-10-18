// src/clients/clients.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Client, ClientDocument } from './schemas/client.schema';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ClientsQueryDto } from './dto/clients-query.dto'; // <-- usa el DTO nuevo

@Injectable()
export class ClientsService {
  constructor(
    @InjectModel(Client.name)
    private readonly clientModel: Model<ClientDocument>,
  ) {}

  async create(dto: CreateClientDto): Promise<Client> {
    const created = new this.clientModel(dto);
    return created.save();
  }

  async findAll(query: ClientsQueryDto) {
    const { page = 1, limit = 10, search, nombre, numDocumento } = query;

    const filter: FilterQuery<ClientDocument> = {};

    if (nombre?.trim()) {
      filter.nombre = { $regex: nombre.trim(), $options: 'i' };
    } else if (numDocumento?.trim()) {
      filter['receptor.numDocumento'] = {
        $regex: numDocumento.trim(),
        $options: 'i',
      };
    } else if (search?.trim()) {
      const s = search.trim();
      filter.$or = [
        { nombre: { $regex: s, $options: 'i' } },
        { correo: { $regex: s, $options: 'i' } },
        { 'receptor.numDocumento': { $regex: s, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.clientModel.find(filter).skip(skip).limit(limit).lean(),
      this.clientModel.countDocuments(filter),
    ]);

    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<Client> {
    const client = await this.clientModel.findById(id).lean();
    if (!client) throw new NotFoundException('Client not found');
    return client;
  }

  async update(id: string, dto: UpdateClientDto): Promise<Client> {
    const client = await this.clientModel
      .findByIdAndUpdate(id, dto, { new: true })
      .lean();
    if (!client) throw new NotFoundException('Client not found');
    return client;
  }

  async remove(id: string): Promise<Client> {
    const client = await this.clientModel
      .findByIdAndUpdate(id, { is_active: false }, { new: true })
      .lean();
    if (!client) throw new NotFoundException('Client not found');
    return client;
  }
}
