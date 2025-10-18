import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateClientDto {
  @IsString() nombre!: string;
  @IsEmail() correo!: string;

  @IsString() municipio!: string;
  @IsString() departamento!: string;
  @IsString() complementario!: string;

  // Nuevos (opcionales)
  @IsOptional() @IsString() tipoDocumento?: string;
  @IsOptional() @IsString() numDocumento?: string;
  @IsOptional() @IsString() nrc?: string;
  @IsOptional() @IsString() codActividad?: string;
  @IsOptional() @IsString() descActividad?: string;

  // Si quieres permitir forzar estado al crear (aunque en el esquema tiene default true)
 // @IsOptional() is_active?: boolean;
}
