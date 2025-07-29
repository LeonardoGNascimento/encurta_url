import { IsUrl } from 'class-validator';

export class CreateUrlDto {
  @IsUrl()
  url: string;

  code: string;
  userId?: number;
}
