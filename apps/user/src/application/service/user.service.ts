import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../../domain/dto/createUser.dto';
import { LoginDto } from '../../domain/dto/login.dto';
import { User } from '../../domain/entity/user.entity';
import { UserRepository } from '../../infra/user.repository';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async create(createUsuarioDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(
      createUsuarioDto.email,
    );

    if (existingUser) {
      throw new ConflictException('Email is already in use');
    }

    const hashedPassword: string = await bcrypt.hash(
      createUsuarioDto.password,
      10,
    );

    return await this.userRepository.create({
      ...createUsuarioDto,
      password: hashedPassword,
    });
  }

  async login(loginDto: LoginDto) {
    const usuario = await this.userRepository.findByEmail(loginDto.email);

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
