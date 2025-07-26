import { Body, Controller, Post } from '@nestjs/common';
import { Usuario } from 'src/usuarios/dominio/entity/usuario.entity';
import { UsuarioService } from './usuario.service';

@Controller('usuario')
export class UsuarioController {
  constructor(private service: UsuarioService) {}

  @Post()
  create(@Body() body: any): Promise<Usuario> {
    return this.service.create(body);
  }

  @Post('/login')
  login(@Body() body: any) {
    return this.service.login(body);
  }
}
