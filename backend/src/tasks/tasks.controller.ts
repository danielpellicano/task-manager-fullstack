// backend/src/tasks/tasks.controller.ts
import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Patch,
    Delete,
    UseGuards,
    Request,
  } from '@nestjs/common';
  import { TasksService } from './tasks.service';
  import { JwtAuthGuard } from '../auth/jwt-auth.guard';
  import { RolesGuard } from '../common/guards/roles.guard';
  
  @Controller('tasks')
  @UseGuards(JwtAuthGuard, RolesGuard)
  export class TasksController {
    constructor(private readonly tasksService: TasksService) {}
  
    @Post()
    create(@Body() body: any, @Request() req) {
      console.log('📥 Payload recebido:', body);
      console.log('👤 Usuário autenticado:', req.user);
      return this.tasksService.create(body, req.user);
    }
  
    @Get()
    findAll(@Request() req) {
      return this.tasksService.findAll(req.user);
    }
  
    @Get(':id')
    findOne(@Param('id') id: string, @Request() req) {
      return this.tasksService.findOne(+id, req.user);
    }
  
    @Patch(':id')
    update(@Param('id') id: string, @Body() body: any, @Request() req) {
      return this.tasksService.update(+id, body, req.user);
    }
  
    @Delete(':id')
    remove(@Param('id') id: string, @Request() req) {
      return this.tasksService.remove(+id, req.user);
    }
  }
  