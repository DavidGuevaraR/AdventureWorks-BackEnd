import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserRole } from '../users/schemas/user.schema';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, { logger: false });
  const usersService = app.get(UsersService);

  const adminEmail = 'admin@example.com';
  const existing = await usersService.findByEmail(adminEmail);
  if (!existing) {
    const createUserDto: CreateUserDto = {
      nombre: 'Administrator',
      dui: '00000000-0',
      email: adminEmail,
      password: 'Admin#123',
      role: UserRole.ADMIN
    };
    await usersService.create(createUserDto);
    console.log('Admin user created: admin@example.com / Admin#123');
  } else {
    console.log('Admin user already exists.');
  }

  await app.close();
}

bootstrap().catch((error) => {
  console.error('Seeding failed', error);
  process.exit(1);
});
