import { SalesService } from './sales.service';
import { SaleStatus } from './schemas/sale.schema';

describe('SalesService', () => {
  it('should generate pdf buffer', async () => {
    const service = new SalesService({} as any);
    const buffer = await service.buildInvoicePdf({
      codigo_generacion: 'TEST',
      detalle_venta: { foo: 'bar' },
      status: SaleStatus.GENERATED,
      createdAt: new Date()
    } as any);

    expect(buffer).toBeInstanceOf(Buffer);
    expect(buffer.length).toBeGreaterThan(0);
  });
});
