// backend/src/tasks/tasks.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Task } from './task.entity';
import { User } from '../users/user.entity'; // 👈
import { UsersModule } from '../users/users.module'; // 👈

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, User]), // 👈 registra os repositórios
    UsersModule, // 👈 importa o módulo com o User
  ],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
