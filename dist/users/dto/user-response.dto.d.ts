import { UserRole } from '../schemas/user.schema';
export declare class UserResponseDto {
    id: string;
    nombre: string;
    dui: string;
    email: string;
    role: UserRole;
    is_active: boolean;
    createdAt: Date;
    updatedAt: Date;
}
