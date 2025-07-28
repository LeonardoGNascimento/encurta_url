import { IsEmail, IsNotEmpty } from 'class-validator';

export class CriarUsuarioDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
