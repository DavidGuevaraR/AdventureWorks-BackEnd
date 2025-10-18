import { Document } from 'mongoose';
export declare enum UserRole {
    ADMIN = "ADMIN",
    SALES = "SALES"
}
export declare class User {
    nombre: string;
    dui: string;
    email: string;
    passwordHash: string;
    role: UserRole;
    is_active: boolean;
}
export type UserDocument = User & Document;
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User> & User & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>> & import("mongoose").FlatRecord<User> & {
    _id: import("mongoose").Types.ObjectId;
}>;
