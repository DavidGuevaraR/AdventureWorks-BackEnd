import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { UsersService } from '../src/users/users.service';
import { UserRole } from '../src/users/schemas/user.schema';

describe('App E2E', () => {
  let app: INestApplication;
  let mongod: MongoMemoryServer;
  let adminToken: string;
  let saleId: string;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    process.env.MONGODB_URI = mongod.getUri();
    process.env.JWT_SECRET = 'testsecret';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: { enableImplicitConversion: true }
      })
    );

    await app.init();

    const usersService = app.get(UsersService);
    await usersService.create({
      nombre: 'Admin',
      dui: '12345678-9',
      email: 'admin@example.com',
      password: 'Admin#123',
      role: UserRole.ADMIN
    });

    const loginRes = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'admin@example.com', password: 'Admin#123' })
      .expect(201);

    adminToken = loginRes.body.access_token;
  });

  afterAll(async () => {
    await app.close();
    await mongoose.connection.close();
    if (mongod) {
      await mongod.stop();
    }
  });

  it('should create and list client', async () => {
    const createRes = await request(app.getHttpServer())
      .post('/api/clients')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        nombre: 'Cliente 1',
        correo: 'cliente1@example.com',
        municipio: 'San Salvador',
        departamento: 'San Salvador'
      })
      .expect(201);

    expect(createRes.body.nombre).toBe('Cliente 1');

    const listRes = await request(app.getHttpServer())
      .get('/api/clients')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(listRes.body.total).toBe(1);
  });

  it('should create product', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ nombre: 'Producto', codigo_producto: 'P-1', precio: 10 })
      .expect(201);

    expect(res.body.codigo_producto).toBe('P-1');
  });

  it('should create sale and cancel it', async () => {
    const detalleVenta = { cliente: 'Cliente 1', items: [{ producto: 'P-1', cantidad: 2 }] };
    const createRes = await request(app.getHttpServer())
      .post('/api/sales')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ codigo_generacion: 'VENTA-1', detalle_venta: detalleVenta })
      .expect(201);

    saleId = createRes.body._id ?? createRes.body.id;
    expect(createRes.body.codigo_generacion).toBe('VENTA-1');

    await request(app.getHttpServer())
      .get(`/api/sales/${saleId}/pdf`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .expect('Content-Type', /pdf/);

    const cancelRes = await request(app.getHttpServer())
      .patch(`/api/sales/${saleId}/cancel`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ reason: 'Cliente solicitó cancelación' })
      .expect(200);

    expect(cancelRes.body.status).toBe('CANCELLED');
    expect(cancelRes.body.cancel_reason).toBe('Cliente solicitó cancelación');
  });
});
