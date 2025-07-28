import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from './domain/dto/createUser.dto';
import { LoginDto } from './domain/dto/login.dto';
import { User } from './domain/entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private urls: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async create(createUsuarioDto: CreateUserDto): Promise<User> {
    const existingUser = await this.urls.findOne({
      where: {
        email: createUsuarioDto.email,
      },
    });

    if (existingUser) {
      throw new ConflictException('Email is already in use');
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
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      usuario.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password, ...result } = usuario;

    return {
      access_token: await this.jwtService.signAsync(result),
    };
  }
}
