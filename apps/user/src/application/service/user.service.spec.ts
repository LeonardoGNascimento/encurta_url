import { Test, TestingModule } from '@nestjs/testing';
import { AuthModule } from '../../../../../shared/auth/auth.module';
import { UserService } from './user.service';
import { UserRepository } from '../../infra/user.repository';

describe('UserService Tests', () => {
  let userService: UserService;
  let userRepository: UserRepository;

  beforeAll(async () => {
    process.env.JWT_SECRET = 'my_secret';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
      providers: [
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

    userService = moduleFixture.get<UserService>(UserService);
    userRepository = moduleFixture.get<UserRepository>(UserRepository);
  });

  it('Should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('create', () => {
    it('If email is already registered should return error', async () => {
      try {
        await userService.create({
          email: 'test@test.com',
          name: 'Test',
          password: '123',
        });
      } catch (e) {
        expect(e).toBeDefined();
        expect(e.message).toEqual('Email is already in use');
      }
    });

    it('Should create user', async () => {
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValueOnce(null);
      const result = await userService.create({
        email: 'test@test.com',
        name: 'Test',
        password: '123',
      });

      expect(result).toBeDefined();
      expect(result.name).toEqual('Test');
    });
  });

  describe('login', () => {
    it('If email not found should return error', async () => {
      try {
        jest.spyOn(userRepository, 'findByEmail').mockResolvedValueOnce(null);
        await userService.login({
          email: 'test@test.com',
          password: '123',
        });
      } catch (e) {
        expect(e).toBeDefined();
        expect(e.message).toEqual('Invalid credentials');
      }
    });

    it('If password is invalid should return error', async () => {
      try {
        await userService.login({
          email: 'test@test.com',
          password: '1233',
        });
      } catch (e) {
        expect(e).toBeDefined();
        expect(e.message).toEqual('Invalid credentials');
      }
    });

    it('Should login', async () => {
      const result = await userService.login({
        email: 'test@test.com',
        password: '123',
      });

      expect(result).toBeDefined();
      expect(result.accessToken).toBeDefined();
    });
  });
});
