import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from 'src/usuarios/dominio/entity/usuario.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario) private urls: Repository<Usuario>,
    private jwtService: JwtService,
  ) {}

  async create(createUsuarioDto: any): Promise<Usuario> {
    const existingUser = await this.urls.findOne({
      where: {
        email: createUsuarioDto.email,
      },
    });

    if (existingUser) {
      throw new ConflictException('Email já está em uso');
    }

    const hashedPassword: string = await bcrypt.hash(
      createUsuarioDto.senha,
      10,
    );

    return await this.urls.save({
      ...createUsuarioDto,
      senha: hashedPassword,
    });
  }

  async login(createUsuarioDto: any) {
    const usuario = await this.urls.findOne({
      where: {
        email: createUsuarioDto.email,
      },
    });

    if (!usuario) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isPasswordValid = await bcrypt.compare(
      createUsuarioDto.senha,
      usuario.senha,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const { senha, ...result } = usuario;

    return {
      access_token: await this.jwtService.signAsync(result),
    };
  }
}
