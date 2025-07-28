import { IsString } from 'class-validator';

export class CreateUrlDto {
  @IsString()
  url: string;

  usuarioId?: number;
}
