import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
export declare class ClientsController {
    private readonly clientsService;
    constructor(clientsService: ClientsService);
    create(dto: CreateClientDto): Promise<import("./schemas/client.schema").Client>;
    findAll(query: PaginationQueryDto): Promise<{
        data: (import("mongoose").FlattenMaps<import("./schemas/client.schema").ClientDocument> & {
            _id: import("mongoose").Types.ObjectId;
        })[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<import("./schemas/client.schema").Client>;
    update(id: string, dto: UpdateClientDto): Promise<import("./schemas/client.schema").Client>;
    disable(id: string): Promise<import("./schemas/client.schema").Client>;
}
