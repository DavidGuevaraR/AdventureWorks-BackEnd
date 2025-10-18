// src/sales/sales.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiProduces,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import { Response, Request } from 'express';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { CancelSaleDto } from './dto/cancel-sale.dto';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { SalesService } from './sales.service';
import { SalesQueryDto } from './dto/sales-query.dto'; // ← usa el DTO con filtros

@ApiTags('sales')
@ApiBearerAuth()
@Controller('sales')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SALES)
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a sale' })
  create(@Body() dto: CreateSaleDto) {
    return this.salesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List sales' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'codigo_generacion', required: false, type: String })
  @ApiQuery({ name: 'tipoDte', required: false, type: String })
  findAll(@Query() query: SalesQueryDto) {            // ← tipa el query correctamente
    return this.salesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get sale by id' })
  findOne(@Param('id') id: string) {
    return this.salesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update sale details' })
  update(@Param('id') id: string, @Body() dto: UpdateSaleDto) {
    return this.salesService.update(id, dto);
  }

  @Get(':id/pdf')
  @ApiOperation({ summary: 'Get sale invoice PDF' })
  @ApiProduces('application/pdf')
  async pdf(@Param('id') id: string, @Res() res: Response) {
    const sale = await this.salesService.findOne(id);
    const buffer = await this.salesService.buildInvoicePdf(sale as any);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename=invoice-${sale.codigo_generacion}.pdf`,
    });
    res.send(buffer);
  }

  @Patch(':id/cancel')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Cancel sale (ADMIN only)' })
  async cancel(
    @Param('id') id: string,
    @Body() dto: CancelSaleDto,
    @Req() req: Request,
  ) {
    const user = req.user as { id: string; role: UserRole };
    return this.salesService.cancel(id, dto, user.id);
  }
}
