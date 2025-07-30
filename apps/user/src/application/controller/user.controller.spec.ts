import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AuthModule } from '../../../../../shared/auth/auth.module';
import { MetricsService } from '../../../../../shared/metrics/metrics.service';
import { UserRepository } from '../../infra/user.repository';
import { UserService } from '../service/user.service';
import { UserController } from './user.controller';

describe('UserController', () => {
  let app: INestApplication;
  let controller: UserController;
  let repository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, ConfigModule.forRoot({ isGlobal: true })],
      controllers: [UserController],
      providers: [
        MetricsService,
        UserService,
        {
          provide: UserRepository,
          useValue: {
            create: jest.fn().mockResolvedValue({
              id: 1,
              name: 'Test',
              email: 'test@test.com',
              password:
                '$2b$10$rd8YS5vks99X2pI.jKy7BOPkCqChFhMrOGDt9Gjzsk5xfeDC1j2US',
            }),
            findByEmail: jest.fn().mockResolvedValue({
              id: 1,
              name: 'Test',
              email: 'test@test.com',
              password:
                '$2b$10$rd8YS5vks99X2pI.jKy7BOPkCqChFhMrOGDt9Gjzsk5xfeDC1j2US',
            }),
          },
        },
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    controller = module.get<UserController>(UserController);
    repository = module.get<UserRepository>(UserRepository);
  });

  afterAll(async () => {
    await app.close();
  });

  it('Controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /user', () => {
    it('Should return an error if email is already registered', async () => {
      const response = await request(app.getHttpServer())
        .post('/')
        .send({
          email: 'test@test.com',
          password: '123',
          name: '123',
        })
        .expect(409);

      const result = response.body;
      expect(result).toBeDefined();
    });

    it('Should create a user', async () => {
      jest.spyOn(repository, 'findByEmail').mockResolvedValueOnce(null);
      const response = await request(app.getHttpServer())
        .post('/')
        .send({
          email: 'test@test.com',
          password: '123',
          name: '123',
        })
        .expect(201);

      expect(response.body).toBeDefined();
    });

    it('Should return error if no body is sent', async () => {
      const response = await request(app.getHttpServer()).post('/').expect(400);

      const result = response.body;
      expect(result).toBeDefined();
    });
  });

  describe('POST /user/login', () => {
    it('Should return an error if email is not found', async () => {
      jest.spyOn(repository, 'findByEmail').mockResolvedValueOnce(null);

      const response = await request(app.getHttpServer())
        .post('/login')
        .send({
          email: 'test@test.com',
          password: '123',
        })
        .expect(401);

      const result = response.body;
      expect(result).toBeDefined();
    });

    it('Should return an error if password is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/login')
        .send({
          email: 'test@test.com',
          password: '1233',
        })
        .expect(401);

      expect(response.body).toBeDefined();
    });

    it('Should log in successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/login')
        .send({
          email: 'test@test.com',
          password: '123',
        })
        .expect(201);

      const result = response.body;
      expect(result).toBeDefined();
    });

    it('Should return an error if no body is sent', async () => {
      const response = await request(app.getHttpServer())
        .post('/login')
        .expect(400);

      const result = response.body;
      expect(result).toBeDefined();
    });
  });
});
