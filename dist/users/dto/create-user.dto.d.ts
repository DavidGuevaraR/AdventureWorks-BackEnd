import { UserRole } from '../schemas/user.schema';
export declare class CreateUserDto {
    nombre: string;
    dui: string;
    email: string;
    password: string;
    role?: UserRole;
}
