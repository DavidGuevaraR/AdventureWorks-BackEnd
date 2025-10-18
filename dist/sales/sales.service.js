"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const sale_schema_1 = require("./schemas/sale.schema");
const PDFDocument = require("pdfkit");
let SalesService = class SalesService {
    constructor(saleModel) {
        this.saleModel = saleModel;
    }
    async create(dto) {
        const exists = await this.saleModel.findOne({ codigo_generacion: dto.codigo_generacion });
        if (exists) {
            throw new common_1.BadRequestException('codigo_generacion must be unique');
        }
        const created = new this.saleModel(dto);
        return created.save();
    }
    async findAll(query) {
        const { page = 1, limit = 10, search } = query;
        const filter = {};
        if (search) {
            filter.$or = [
                { codigo_generacion: { $regex: search, $options: 'i' } },
                { 'detalle_venta.cliente': { $regex: search, $options: 'i' } }
            ];
        }
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.saleModel
                .find(filter)
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .lean(),
            this.saleModel.countDocuments(filter)
        ]);
        return { data, total, page, limit };
    }
    async findOne(id) {
        const sale = await this.saleModel.findById(id).lean().exec();
        if (!sale)
            throw new common_1.NotFoundException('Sale not found');
        return sale;
    }
    async update(id, dto) {
        const sale = await this.saleModel.findById(id);
        if (!sale) {
            throw new common_1.NotFoundException('Sale not found');
        }
        if (sale.status === sale_schema_1.SaleStatus.CANCELLED) {
            throw new common_1.ForbiddenException('Cannot update a cancelled sale');
        }
        if (dto.detalle_venta) {
            sale.detalle_venta = dto.detalle_venta;
        }
        if (dto.codigo_generacion && dto.codigo_generacion !== sale.codigo_generacion) {
            const exists = await this.saleModel.findOne({ codigo_generacion: dto.codigo_generacion });
            if (exists) {
                throw new common_1.BadRequestException('codigo_generacion must be unique');
            }
            sale.codigo_generacion = dto.codigo_generacion;
        }
        await sale.save();
        return sale.toObject();
    }
    async cancel(id, dto, cancelledBy) {
        const sale = await this.saleModel.findById(id);
        if (!sale) {
            throw new common_1.NotFoundException('Sale not found');
        }
        if (sale.status === sale_schema_1.SaleStatus.CANCELLED) {
            throw new common_1.BadRequestException('Sale already cancelled');
        }
        sale.status = sale_schema_1.SaleStatus.CANCELLED;
        sale.cancel_reason = dto.reason;
        sale.cancel_date = new Date();
        sale.cancelled_by = cancelledBy;
        await sale.save();
        return sale.toObject();
    }
    async buildInvoicePdf(sale) {
        return await new Promise((resolve) => {
            const doc = new PDFDocument({ margin: 50 });
            const chunks = [];
            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.fontSize(18).text('Factura Simulada', { align: 'center' });
            doc.moveDown();
            doc.fontSize(12).text(`Código de Generación: ${sale.codigo_generacion}`);
            doc.text(`Estado: ${sale.status}`);
            doc.text(`Fecha: ${new Date(sale.createdAt ?? Date.now()).toLocaleString()}`);
            doc.moveDown();
            doc.fontSize(14).text('Detalle de la Venta');
            doc.moveDown();
            doc.fontSize(10).text(JSON.stringify(sale.detalle_venta, null, 2));
            if (sale.status === sale_schema_1.SaleStatus.CANCELLED) {
                doc.moveDown();
                doc.fontSize(12).fillColor('red').text(`Cancelado: ${sale.cancel_reason}`);
                doc.fillColor('black');
            }
            doc.end();
        });
    }
};
exports.SalesService = SalesService;
exports.SalesService = SalesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(sale_schema_1.Sale.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], SalesService);
//# sourceMappingURL=sales.service.js.map