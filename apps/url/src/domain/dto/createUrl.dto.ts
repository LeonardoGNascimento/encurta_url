import { IsString } from 'class-validator';

export class CreateUrlDto {
  @IsString()
  url: string;

  code: string;
  usuarioId?: number;
}
