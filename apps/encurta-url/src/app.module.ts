import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Url } from './dominio/entity/url.entity';
import { AuthModule } from '../../../shared/auth/auth.module';
import { Click } from './dominio/entity/clicks.entity';

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
        database: config.get('DATABASE_SCHEMA_URL'),
        entities: [Url, Click],
        synchronize: true,
      }),
    }),
    TypeOrmModule.forFeature([Url, Click]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
