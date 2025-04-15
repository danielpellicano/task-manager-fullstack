import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';
import * as bcrypt from 'bcrypt';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true, // Desligar em produção
    }),
    AuthModule,
    UsersModule,
    TasksModule,
  ],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly usersService: UsersService) {}

  async onModuleInit() {
    const adminEmail = 'admin@admin.com';
    const existing = await this.usersService.findByEmail(adminEmail);

    if (!existing) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await this.usersService.create({
        name: 'Administrador',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
      });
      console.log('✅ Usuário admin criado com sucesso.');
    } else {
      console.log('ℹ️ Usuário admin já existe.');
    }
  }
}
