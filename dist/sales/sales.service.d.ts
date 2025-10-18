import { Model } from 'mongoose';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { CancelSaleDto } from './dto/cancel-sale.dto';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { Sale, SaleDocument } from './schemas/sale.schema';
export declare class SalesService {
    private readonly saleModel;
    constructor(saleModel: Model<SaleDocument>);
    create(dto: CreateSaleDto): Promise<Sale>;
    findAll(query: PaginationQueryDto): Promise<{
        data: (import("mongoose").FlattenMaps<SaleDocument> & {
            _id: import("mongoose").Types.ObjectId;
        })[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<Sale>;
    update(id: string, dto: UpdateSaleDto): Promise<Sale>;
    cancel(id: string, dto: CancelSaleDto, cancelledBy: string): Promise<Sale>;
    buildInvoicePdf(sale: Sale): Promise<Buffer>;
}
