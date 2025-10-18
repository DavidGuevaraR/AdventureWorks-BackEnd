// src/sales/dto/sales-query.dto.ts
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class SalesQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  codigo_generacion?: string;

  @IsOptional()
  @IsString()
  tipoDte?: string;
}
