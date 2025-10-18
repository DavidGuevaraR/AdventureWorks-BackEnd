import { Document } from 'mongoose';
export declare class Client {
    nombre: string;
    correo: string;
    municipio: string;
    departamento: string;
    complementario?: string;
    is_active: boolean;
}
export type ClientDocument = Client & Document;
export declare const ClientSchema: import("mongoose").Schema<Client, import("mongoose").Model<Client, any, any, any, Document<unknown, any, Client> & Client & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Client, Document<unknown, {}, import("mongoose").FlatRecord<Client>> & import("mongoose").FlatRecord<Client> & {
    _id: import("mongoose").Types.ObjectId;
}>;
