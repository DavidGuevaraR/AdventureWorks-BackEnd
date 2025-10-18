import { Model } from 'mongoose';
import { Client, ClientDocument } from './schemas/client.schema';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
export declare class ClientsService {
    private readonly clientModel;
    constructor(clientModel: Model<ClientDocument>);
    create(dto: CreateClientDto): Promise<Client>;
    findAll(query: PaginationQueryDto): Promise<{
        data: (import("mongoose").FlattenMaps<ClientDocument> & {
            _id: import("mongoose").Types.ObjectId;
        })[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<Client>;
    update(id: string, dto: UpdateClientDto): Promise<Client>;
    remove(id: string): Promise<Client>;
}
