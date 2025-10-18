"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const app_module_1 = require("../app.module");
const users_service_1 = require("../users/users.service");
const user_schema_1 = require("../users/schemas/user.schema");
async function bootstrap() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule, { logger: false });
    const usersService = app.get(users_service_1.UsersService);
    const adminEmail = 'admin@example.com';
    const existing = await usersService.findByEmail(adminEmail);
    if (!existing) {
        const createUserDto = {
            nombre: 'Administrator',
            dui: '00000000-0',
            email: adminEmail,
            password: 'Admin#123',
            role: user_schema_1.UserRole.ADMIN
        };
        await usersService.create(createUserDto);
        console.log('Admin user created: admin@example.com / Admin#123');
    }
    else {
        console.log('Admin user already exists.');
    }
    await app.close();
}
bootstrap().catch((error) => {
    console.error('Seeding failed', error);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map