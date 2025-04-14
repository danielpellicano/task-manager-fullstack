import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string) {
    try {
      const user = await this.usersService.findByEmail(email);
      console.log('🔍 Usuário encontrado:', user);

      if (!user) {
        console.log('❌ Usuário não encontrado');
        return null;
      }

      const passwordValid = await bcrypt.compare(pass, user.password);
      console.log('🔐 Senha válida?', passwordValid);

      if (!passwordValid) {
        console.log('❌ Senha incorreta');
        return null;
      }

      const { password, ...result } = user;
      return result;
    } catch (error) {
      console.error('❗Erro ao validar usuário:', error);
      throw new UnauthorizedException('Erro interno na validação do usuário');
    }
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(data: any) {
    const userExists = await this.usersService.findByEmail(data.email);
    if (userExists) throw new UnauthorizedException('Email já cadastrado');
  
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const created = await this.usersService.create({
      ...data,
      password: hashedPassword,
    });
  
    // Remover a senha do retorno antes de passar para login()
    const { password, ...userWithoutPassword } = created;
    return userWithoutPassword;
  }
}
