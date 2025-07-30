import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthModule } from '../../../../../shared/auth/auth.module';
import { ClickRepository } from '../../infra/click.repository';
import { UrlRepository } from '../../infra/url.repository';
import { UrlService } from './url.service';

describe('UrlService Tests', () => {
  let urlService: UrlService;
  let urlRepository: UrlRepository;
  let clickRepository: ClickRepository;

  beforeAll(async () => {
    process.env.JWT_SECRET = 'my_secret';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AuthModule,
        ConfigModule.forRoot({
          isGlobal: true,
        }),
      ],
      providers: [
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

    urlService = moduleFixture.get<UrlService>(UrlService);
    urlRepository = moduleFixture.get<UrlRepository>(UrlRepository);
    clickRepository = moduleFixture.get<ClickRepository>(ClickRepository);
  });

  it('Should be defined', () => {
    expect(urlService).toBeDefined();
  });

  describe('generateRandomString', () => {
    it('Should generate code', async () => {
      const result = urlService.generateRandomString(1);

      expect(result).toBeDefined();
    });
  });

  describe('list', () => {
    it('Should list URLs', async () => {
      const result = await urlService.list(1);

      expect(result).toBeDefined();
    });
  });

  describe('findByIdAndUser', () => {
    it('Should find URL by user and id', async () => {
      const result = await urlService.findByIdAndUser({
        id: 1,
        userId: 1,
      });

      expect(result).toBeDefined();
      expect(result.code).toEqual('t99L2f');
    });

    it('Should return error if not found', async () => {
      try {
        jest
          .spyOn(urlRepository, 'findByIdAndUser')
          .mockResolvedValueOnce(null);
        await urlService.findByIdAndUser({
          id: 1,
          userId: 1,
        });
      } catch (e) {
        expect(e).toBeDefined();
        expect(e.message).toEqual('Url not found');
      }
    });
  });

  describe('delete', () => {
    it('Should return error if not found', async () => {
      try {
        jest
          .spyOn(urlRepository, 'findByIdAndUser')
          .mockResolvedValueOnce(null);
        await urlService.delete({ id: 1, userId: 1 });
      } catch (e) {
        expect(e).toBeDefined();
        expect(e.message).toEqual('Url not found');
      }
    });

    it('Should delete URL', async () => {
      const result = await urlService.delete({ id: 1, userId: 1 });

      expect(result).toBeTruthy();
    });
  });

  describe('update', () => {
    it('Should return error if not found', async () => {
      try {
        jest
          .spyOn(urlRepository, 'findByIdAndUser')
          .mockResolvedValueOnce(null);
        await urlService.update({ id: 1, url: 'http://test.com', userId: 1 });
      } catch (e) {
        expect(e).toBeDefined();
        expect(e.message).toEqual('Url not found');
      }
    });

    it('Should update URL', async () => {
      const result = await urlService.update({
        id: 1,
        url: 'http://test.com',
        userId: 1,
      });

      expect(result).toBeTruthy();
    });
  });

  describe('get', () => {
    it('Should return error if not found', async () => {
      try {
        jest.spyOn(urlRepository, 'get').mockResolvedValueOnce(null);
        await urlService.get('1234');
      } catch (e) {
        expect(e).toBeDefined();
        expect(e.message).toEqual('Url not found');
      }
    });

    it('Should return URL', async () => {
      const result = await urlService.get('1234');

      expect(result).toBeDefined();
      expect(result.statusCode).toEqual(302);
      expect(result.url).toEqual('https://www.google.com/');
    });
  });

  describe('create', () => {
    it('Should create URL', async () => {
      jest.spyOn(urlRepository, 'get').mockResolvedValueOnce(null);
      const result = await urlService.create({
        url: 'https://google.com',
      });

      expect(result).toBeDefined();
      expect(result.url).toBeDefined();
    });

    it('Should create URL without protocol', async () => {
      jest.spyOn(urlRepository, 'get').mockResolvedValueOnce(null);
      const result = await urlService.create({
        url: 'google.com',
      });

      expect(result).toBeDefined();
      expect(result.url).toBeDefined();
    });

    it('If a generated code already exists, should create URL', async () => {
      jest
        .spyOn(urlService, 'generateRandomString')
        .mockImplementationOnce(() => 't99L2f');

      jest
        .spyOn(urlRepository, 'get')
        .mockResolvedValueOnce({
          id: 1,
          code: 't99L2f',
          url: 'https://www.google.com/',
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          deleted: undefined,
          clicks: [],
        })
        .mockResolvedValueOnce(null);

      const result = await urlService.create({
        url: 'google.com',
      });

      expect(result).toBeDefined();
      expect(result.url).toBeDefined();
    });
  });
});
