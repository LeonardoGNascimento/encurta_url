import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto } from './domain/dto/login.dto';
import { User } from './domain/entity/user.entity';
import { CreateUserDto } from './domain/dto/createUser.dto';

@Controller()
export class UserController {
  constructor(private service: UserService) {}

  @Post()
  async create(@Body() body: CreateUserDto): Promise<User> {
    return await this.service.create(body);
  }

  @Post('/login')
  login(@Body() body: LoginDto) {
    return this.service.login(body);
  }
}
