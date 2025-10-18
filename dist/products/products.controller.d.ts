import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(dto: CreateProductDto): Promise<import("./schemas/product.schema").Product>;
    findAll(query: PaginationQueryDto): Promise<{
        data: (import("mongoose").FlattenMaps<import("./schemas/product.schema").ProductDocument> & {
            _id: import("mongoose").Types.ObjectId;
        })[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<import("./schemas/product.schema").Product>;
    update(id: string, dto: UpdateProductDto): Promise<import("./schemas/product.schema").Product>;
    disable(id: string): Promise<import("./schemas/product.schema").Product>;
}
