// backend/src/auth/auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      return { message: 'Credenciais inválidas' };
    }
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() data: CreateUserDto) {
    const user = await this.authService.register(data);
    return this.authService.login(user); // <- Isso gera e retorna o token
  }
}
