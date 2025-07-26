import { Body, Controller, Post } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { Usuario } from './dominio/entity/usuario.entity';
import { CriarUsuarioDto } from './dominio/dto/createUser.dto';
import { LoginDto } from './dominio/dto/login.dto';

@Controller()
export class UsuarioController {
  constructor(private service: UsuarioService) {}

  @Post()
  async create(@Body() body: CriarUsuarioDto): Promise<Usuario> {
    return await this.service.create(body);
  }

  @Post('/login')
  login(@Body() body: LoginDto) {
    return this.service.login(body);
  }
}
