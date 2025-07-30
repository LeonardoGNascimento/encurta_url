import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'shared/auth/auth.module';
import { MetricsController } from 'shared/metrics/metrics.controller';
import { MetricsService } from 'shared/metrics/metrics.service';
import { UserController } from './application/controller/user.controller';
import { UserService } from './application/service/user.service';
import { User } from './domain/entity/user.entity';
import { UserRepository } from './infra/user.repository';

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
  providers: [MetricsService, UserService, UserRepository],
  controllers: [UserController, MetricsController],
})
export class UsuarioModule {}
