import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsString } from 'class-validator';
import { JsonValue } from '../schemas/sale.schema';

export class CreateSaleDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  codigo_generacion!: string;

  @ApiProperty({
    description: 'Arbitrary sale payload in JSON format',
    oneOf: [
      { type: 'object', additionalProperties: true },
      { type: 'array', items: {} },
      { type: 'string' },
      { type: 'number' },
      { type: 'boolean' }
    ],
    nullable: true
  })
  @IsDefined()
  detalle_venta!: JsonValue;
}
