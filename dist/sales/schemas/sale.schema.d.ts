import { Document } from 'mongoose';
export type JsonValue = string | number | boolean | null | JsonValue[] | {
    [key: string]: JsonValue;
};
export declare enum SaleStatus {
    GENERATED = "GENERATED",
    CANCELLED = "CANCELLED"
}
export declare class Sale {
    codigo_generacion: string;
    detalle_venta: JsonValue;
    status: SaleStatus;
    cancel_reason?: string;
    cancel_date?: Date;
    cancelled_by?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export type SaleDocument = Sale & Document;
export declare const SaleSchema: import("mongoose").Schema<Sale, import("mongoose").Model<Sale, any, any, any, Document<unknown, any, Sale> & Sale & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Sale, Document<unknown, {}, import("mongoose").FlatRecord<Sale>> & import("mongoose").FlatRecord<Sale> & {
    _id: import("mongoose").Types.ObjectId;
}>;
