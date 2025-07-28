import { Body, Controller, Post } from '@nestjs/common';
import { UsuarioService } from './user.service';
import { LoginDto } from './dominio/dto/login.dto';
import { User } from './dominio/entity/user.entity';
import { CreateUserDto } from './dominio/dto/createUser.dto';

@Controller()
export class UsuarioController {
  constructor(private service: UsuarioService) {}

  @Post()
  async create(@Body() body: CreateUserDto): Promise<User> {
    return await this.service.create(body);
  }

  @Post('/login')
  login(@Body() body: LoginDto) {
    return this.service.login(body);
  }
}
