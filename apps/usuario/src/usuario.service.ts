import {
  ConflictException,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Usuario } from './dominio/entity/usuario.entity';
import { CriarUsuarioDto } from './dominio/dto/createUser.dto';
import { LoginDto } from './dominio/dto/login.dto';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario) private urls: Repository<Usuario>,
    private jwtService: JwtService,
  ) {}

  async create(createUsuarioDto: CriarUsuarioDto): Promise<Usuario> {
    const existingUser = await this.urls.findOne({
      where: {
        email: createUsuarioDto.email,
      },
    });

    if (existingUser) {
      throw new ConflictException('Email já está em uso');
    }

    const hashedPassword: string = await bcrypt.hash(
      createUsuarioDto.password,
      10,
    );

    return await this.urls.save({
      ...createUsuarioDto,
      senha: hashedPassword,
    });
  }

  async login(loginDto: LoginDto) {
    const usuario = await this.urls.findOne({
      where: {
        email: loginDto.email,
      },
    });

    if (!usuario) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      usuario.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const { password, ...result } = usuario;

    return {
      access_token: await this.jwtService.signAsync(result),
    };
  }
}
