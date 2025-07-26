import { Usuarios } from 'src/usuarios/dominio/entity/usuario.entity';

declare module 'express' {
  interface Request {
    user?: Partial<Usuarios>; // ou um tipo JWT com os campos esperados
  }
}
