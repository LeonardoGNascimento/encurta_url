import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from '../../domain/dto/createUser.dto';
import { LoginDto } from '../../domain/dto/login.dto';
import { LoginReturnDto } from '../../domain/dto/login.return.dto';
import { User } from '../../domain/entity/user.entity';
import { UserService } from '../service/user.service';

@Controller()
export class UserController {
  constructor(private service: UserService) {}

  @Post()
  create(@Body() body: CreateUserDto): Promise<User> {
    return this.service.create(body);
  }

  @Post('/login')
  login(@Body() body: LoginDto): Promise<LoginReturnDto> {
    return this.service.login(body);
  }
}
