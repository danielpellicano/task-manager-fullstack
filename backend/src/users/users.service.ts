// backend/src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(data: Partial<User>): Promise<User> {
    const user = this.usersRepository.create(data);
    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  // ✅ Novo método para buscar usuários com suas tarefas
  async findAllWithTasks(): Promise<User[]> {
    return this.usersRepository.find({
      relations: ['tasks'],
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        tasks: {
          id: true,
          title: true,
          description: true,
          done: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    });
  }
  

  async findById(id: number): Promise<User> {
    return this.usersRepository.findOne({ where: { id }, relations: ['tasks'] });
  }

  async findByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async createAdminUser() {
    const adminEmail = 'admin@admin.com';

    const existing = await this.findByEmail(adminEmail);
    if (!existing) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await this.create({
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
