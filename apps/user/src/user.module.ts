import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'shared/auth/auth.module';
import { User } from './domain/entity/user.entity';
import { UserService } from './application/service/user.service';
import { UserRepository } from './infra/user.repository';
import { UserController } from './application/controller/user.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mariadb',
        host: config.get('DATABASE_HOST'),
        port: 3306,
        username: config.get('DATABASE_USER'),
        password: config.get('DATABASE_PASSWORD'),
        database: config.get('DATABASE_SCHEMA'),
        entities: [User],
        synchronize: true,
      }),
    }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [UserService, UserRepository],
  controllers: [UserController],
})
export class UsuarioModule {}
