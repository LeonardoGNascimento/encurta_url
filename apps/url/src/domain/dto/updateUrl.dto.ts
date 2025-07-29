import { IsString } from 'class-validator';

export class UpdateUrlDto {
  @IsString()
  url: string;

  id: number;
  userId: number;
}
