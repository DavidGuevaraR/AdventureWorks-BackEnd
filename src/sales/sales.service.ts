// src/sales/sales.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { CancelSaleDto } from './dto/cancel-sale.dto';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { Sale, SaleDocument, SaleStatus } from './schemas/sale.schema';
import { SalesQueryDto } from './dto/sales-query.dto'; // ← usa el DTO con filtros
import PDFDocument = require('pdfkit');

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

@Injectable()
export class SalesService {
  constructor(
    @InjectModel(Sale.name)
    private readonly saleModel: Model<SaleDocument>,
  ) {}

  // Crear
  async create(dto: CreateSaleDto): Promise<Sale> {
    if (!dto?.codigo_generacion?.trim()) {
      throw new BadRequestException('codigo_generacion is required');
    }
    const exists = await this.saleModel.findOne({
      codigo_generacion: dto.codigo_generacion,
    });
    if (exists) {
      throw new BadRequestException('codigo_generacion must be unique');
    }
    const created = new this.saleModel(dto);
    const saved = await created.save();
    return saved.toObject() as Sale;
  }

  // Listar con paginación + filtros (codigo_generacion, tipoDte) + búsqueda libre
  async findAll(query: SalesQueryDto) {
    const {
      page = 1,
      limit = 10,
      search,
      codigo_generacion,
      tipoDte,
    } = query;

    const filter: FilterQuery<SaleDocument> = {};

    // Búsqueda libre
    if (search?.trim()) {
      const s = search.trim();
      filter.$or = [
        { codigo_generacion: { $regex: s, $options: 'i' } },
        // Ajusta si guardas el nombre del cliente en otro campo:
        { 'detalle_venta.cliente': { $regex: s, $options: 'i' } },
      ];
    }

    // Filtro por código de generación (prefijo; cambia a igualdad si lo quieres exacto)
    if (codigo_generacion?.trim()) {
      filter.codigo_generacion = {
        $regex: '^' + escapeRegex(codigo_generacion.trim()),
        $options: 'i',
      };
    }

    // Filtro por tipo de DTE (exacto)
    if (tipoDte?.trim()) {
      filter['detalle_venta.identificacion.tipoDte'] = tipoDte.trim();
    }

    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.max(1, Number(limit) || 10);
    const skip = (safePage - 1) * safeLimit;

    const [data, total] = await Promise.all([
      this.saleModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(safeLimit)
        .lean<Sale>()
        .exec(),
      this.saleModel.countDocuments(filter).exec(),
    ]);

    return {
      data,
      total,
      page: safePage,
      limit: safeLimit,
    };
  }

  // Obtener una
  async findOne(id: string): Promise<Sale> {
    const sale = await this.saleModel.findById(id).lean<Sale>().exec();
    if (!sale) throw new NotFoundException('Sale not found');
    return sale;
  }

  // Actualizar
  async update(id: string, dto: UpdateSaleDto): Promise<Sale> {
    const sale = await this.saleModel.findById(id);
    if (!sale) {
      throw new NotFoundException('Sale not found');
    }
    if (sale.status === SaleStatus.CANCELLED) {
      throw new ForbiddenException('Cannot update a cancelled sale');
    }

    if (dto.detalle_venta) {
      sale.detalle_venta = dto.detalle_venta;
    }

    if (
      dto.codigo_generacion &&
      dto.codigo_generacion.trim() &&
      dto.codigo_generacion !== sale.codigo_generacion
    ) {
      const exists = await this.saleModel.findOne({
        codigo_generacion: dto.codigo_generacion,
      });
      if (exists) {
        throw new BadRequestException('codigo_generacion must be unique');
      }
      sale.codigo_generacion = dto.codigo_generacion.trim();
    }

    await sale.save();
    return sale.toObject() as Sale;
  }

  // Cancelar (anular)
  async cancel(
    id: string,
    dto: CancelSaleDto,
    cancelledBy: string,
  ): Promise<Sale> {
    const sale = await this.saleModel.findById(id);
    if (!sale) {
      throw new NotFoundException('Sale not found');
    }
    if (sale.status === SaleStatus.CANCELLED) {
      throw new BadRequestException('Sale already cancelled');
    }
    const reason = dto?.reason?.trim();
    if (!reason) {
      throw new BadRequestException('reason is required');
    }

    sale.status = SaleStatus.CANCELLED;
    sale.cancel_reason = reason;
    sale.cancel_date = new Date();
    sale.cancelled_by = cancelledBy;

    await sale.save();
    return sale.toObject() as Sale;
  }

  // PDF (simulado)
  async buildInvoicePdf(sale: Sale): Promise<Buffer> {
    return await new Promise<Buffer>((resolve) => {
      const doc = new PDFDocument({ margin: 50 });
      const chunks: Buffer[] = [];
      doc.on('data', (chunk) => chunks.push(chunk as Buffer));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      doc.fontSize(18).text('Factura Simulada', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text(`Código de Generación: ${sale.codigo_generacion}`);
      doc.text(`Estado: ${sale.status}`);
      doc.text(
        `Fecha: ${new Date((sale as any).createdAt ?? Date.now()).toLocaleString()}`,
      );
      doc.moveDown();
      doc.fontSize(14).text('Detalle de la Venta');
      doc.moveDown();
      doc.fontSize(10).text(JSON.stringify(sale.detalle_venta, null, 2));
      if (sale.status === SaleStatus.CANCELLED) {
        doc.moveDown();
        doc.fontSize(12).fillColor('red').text(`Cancelado: ${sale.cancel_reason}`);
        doc.fillColor('black');
      }
      doc.end();
    });
  }
}
