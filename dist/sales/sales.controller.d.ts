import { Response, Request } from 'express';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { CancelSaleDto } from './dto/cancel-sale.dto';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { SalesService } from './sales.service';
export declare class SalesController {
    private readonly salesService;
    constructor(salesService: SalesService);
    create(dto: CreateSaleDto): Promise<import("./schemas/sale.schema").Sale>;
    findAll(query: PaginationQueryDto): Promise<{
        data: (import("mongoose").FlattenMaps<import("./schemas/sale.schema").SaleDocument> & {
            _id: import("mongoose").Types.ObjectId;
        })[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<import("./schemas/sale.schema").Sale>;
    update(id: string, dto: UpdateSaleDto): Promise<import("./schemas/sale.schema").Sale>;
    pdf(id: string, res: Response): Promise<void>;
    cancel(id: string, dto: CancelSaleDto, req: Request): Promise<import("./schemas/sale.schema").Sale>;
}
