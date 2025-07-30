import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AuthModule } from '../../../../../shared/auth/auth.module';
import { MetricsService } from '../../../../../shared/metrics/metrics.service';
import { ClickRepository } from '../../infra/click.repository';
import { UrlRepository } from '../../infra/url.repository';
import { UrlService } from '../service/url.service';
import { UrlController } from './url.controller';

describe('UrlController', () => {
  let app: INestApplication;
  let controller: UrlController;
  let service: UrlService;
  let jwtService: JwtService;
  let repository: UrlRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, ConfigModule.forRoot({ isGlobal: true })],
      controllers: [UrlController],
      providers: [
        MetricsService,
        UrlService,
        {
          provide: ClickRepository,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: UrlRepository,
          useValue: {
            list: jest.fn().mockResolvedValue([
              {
                id: 1,
                code: 't99L2f',
                url: 'https://www.google.com/',
                userId: 1,
                createdAt: '2025-07-30T10:48:00.273Z',
                updatedAt: '2025-07-30T10:48:00.273Z',
                deleted: null,
                totalClicks: 0,
              },
            ]),
            findByIdAndUser: jest.fn().mockResolvedValue({
              id: 1,
              code: 't99L2f',
              url: 'https://www.google.com/',
              userId: 1,
              createdAt: '2025-07-30T10:48:00.273Z',
              updatedAt: '2025-07-30T10:48:00.273Z',
              deleted: null,
            }),
            delete: jest.fn().mockResolvedValue(true),
            update: jest.fn().mockResolvedValue(true),
            get: jest.fn().mockResolvedValue({
              id: 1,
              code: 't99L2f',
              url: 'https://www.google.com/',
              userId: 1,
              createdAt: '2025-07-30T10:48:00.273Z',
              updatedAt: '2025-07-30T10:48:00.273Z',
              deleted: null,
            }),
            create: jest.fn().mockResolvedValue({
              id: 1,
              code: 't99L2f',
              url: 'https://www.google.com/',
              userId: 1,
              createdAt: '2025-07-30T10:48:00.273Z',
              updatedAt: '2025-07-30T10:48:00.273Z',
              deleted: null,
            }),
          },
        },
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    controller = module.get<UrlController>(UrlController);
    service = module.get<UrlService>(UrlService);
    repository = module.get<UrlRepository>(UrlRepository);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('Controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /', () => {
    it('Should create a URL', async () => {
      const token = await jwtService.signAsync({ id: 1 });
      const response = await request(app.getHttpServer())
        .post('/')
        .set('Authorization', `Bearer ${token}`)
        .send({
          url: 'google.com',
        })
        .expect(201);

      const result = response.body;
      expect(result).toBeDefined();
    });

    it('Should return error if no body is sent', async () => {
      const token = await jwtService.signAsync({ id: 1 });
      const response = await request(app.getHttpServer())
        .post('/')
        .set('Authorization', `Bearer ${token}`)
        .expect(400);

      const result = response.body;
      expect(result).toBeDefined();
    });
  });

  describe('GET /', () => {
    it('Should return user URLs', async () => {
      const token = await jwtService.signAsync({ id: 1 });
      const response = await request(app.getHttpServer())
        .get('/')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      const result = response.body;
      expect(result).toBeDefined();
    });

    it('Should return error if no token is provided', async () => {
      const response = await request(app.getHttpServer()).get('/').expect(401);

      const result = response.body;
      expect(result).toBeDefined();
    });
  });

  describe('DELETE /{id}', () => {
    it('Should delete user URL', async () => {
      const token = await jwtService.signAsync({ id: 1 });
      await request(app.getHttpServer())
        .delete('/1')
        .set('Authorization', `Bearer ${token}`)
        .expect(204);
    });

    it('Should return error if no token is provided', async () => {
      const response = await request(app.getHttpServer())
        .delete('/1')
        .expect(401);

      const result = response.body;
      expect(result).toBeDefined();
    });
  });

  describe('PATCH /{id}', () => {
    it('Should update user URL', async () => {
      const token = await jwtService.signAsync({ id: 1 });
      await request(app.getHttpServer())
        .patch('/1')
        .send({
          url: 'google.com',
        })
        .set('Authorization', `Bearer ${token}`)
        .expect(204);
    });

    it('Should return error if no token is provided', async () => {
      const response = await request(app.getHttpServer())
        .delete('/1')
        .send({
          url: 'google.com',
        })
        .expect(401);

      const result = response.body;
      expect(result).toBeDefined();
    });
  });

  describe('GET /{code}', () => {
    it('Should access URL', async () => {
      await request(app.getHttpServer()).get('/ad28ca').expect(302);
    });

    it('Should return error if URL not found', async () => {
      jest.spyOn(repository, 'get').mockResolvedValueOnce(null);

      const response = await request(app.getHttpServer())
        .get('/ad28ca')
        .expect(404);

      const result = response.body;
      expect(result).toBeDefined();
    });
  });
});
