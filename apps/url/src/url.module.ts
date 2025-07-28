import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../../../shared/auth/auth.module';
import { Click } from './domain/entity/clicks.entity';
import { Url } from './domain/entity/url.entity';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';

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
  controllers: [UrlController],
  providers: [UrlService],
})
export class UrlModule {}
