// backend/src/tasks/tasks.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepo: Repository<Task>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async create(task: Partial<Task>, user: User) {
    if (!user || !user.id) {
      throw new Error('Usuário não fornecido');
    }
  
    // Pegue a entidade User completa do banco
    const fullUser = await this.userRepo.findOne({ where: { id: user.id } });
    if (!fullUser) {
      throw new Error(`Usuário ID ${user.id} não encontrado`);
    }
  
    const newTask = this.taskRepo.create({
      title: task.title,
      description: task.description,
      user: fullUser,
    });
  
    return this.taskRepo.save(newTask);
  }
  

  async findAll(user: User) {
    if (user.role === 'admin') {
      return this.taskRepo.find();
    }
    return this.taskRepo.find({ where: { user: { id: user.id } } });
  }

  async findOne(id: number, user: User) {
    const task = await this.taskRepo.findOne({
      where: { id },
      relations: ['user'],
    });
  
    if (!task) {
      console.warn(`❌ Tarefa ID ${id} não encontrada no banco`);
      throw new NotFoundException('Tarefa não encontrada');
    }
  
    // ⚠️ VERIFICA task.user ANTES DE ACESSAR task.user.id
    if (!task.user) {
      console.warn(`⚠️ Tarefa ID ${id} sem usuário associado`);
      throw new ForbiddenException('Tarefa sem dono. Acesso negado.');
    }
  
    // Só acessa .id se task.user estiver presente
    if (user.role !== 'admin' && task.user.id !== user.id) {
      console.warn(`⚠️ Usuário ${user.id} tentou acessar tarefa de outro usuário`);
      throw new ForbiddenException('Acesso negado');
    }
  
    console.log('✅ Tarefa validada para acesso:', task);
  
    return task;
  }
  

  async update(id: number, data: Partial<Task>, user: User) {
    const task = await this.findOne(id, user);
    Object.assign(task, data);
    return this.taskRepo.save(task);
  }

  async remove(id: number, user: User) {
    console.log(`🗑️ Requisição para deletar tarefa ID ${id} pelo usuário ID ${user.id}`);
    const task = await this.findOne(id, user);
    return this.taskRepo.remove(task);
  }

  async findAllTasksWithUsers(): Promise<Task[]> {
    return this.taskRepo.find({
      relations: ['user'],
      select: {
        id: true,
        title: true,
        description: true,
        done: true,
        createdAt: true,
        updatedAt: true,
        user: {
          id: true,
          name: true,
          email: true,
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }
}
