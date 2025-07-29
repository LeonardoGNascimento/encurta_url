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
              name: 'Teste',
              email: 'teste@teste.com',
              password:
                '$2b$10$rd8YS5vks99X2pI.jKy7BOPkCqChFhMrOGDt9Gjzsk5xfeDC1j2US',
            }),
            findByEmail: jest.fn().mockResolvedValue({
              id: 1,
              name: 'Teste',
              email: 'teste@teste.com',
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
    it('Se email já estiver cadastrado deve retornar erro', async () => {
      try {
        await userService.create({
          email: 'teste@teste.com',
          name: 'Teste',
          password: '123',
        });
      } catch (e) {
        expect(e).toBeDefined();
        expect(e.message).toEqual('Email is already in use');
      }
    });

    it('Deve criar usuario', async () => {
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValueOnce(null);
      const result = await userService.create({
        email: 'teste@teste.com',
        name: 'Teste',
        password: '123',
      });

      expect(result).toBeDefined();
      expect(result.name).toEqual('Teste');
    });
  });

  describe('login', () => {
    it('Se não encontrar email cadastrado deve retornar erro', async () => {
      try {
        jest.spyOn(userRepository, 'findByEmail').mockResolvedValueOnce(null);
        await userService.login({
          email: 'teste@teste.com',
          password: '123',
        });
      } catch (e) {
        expect(e).toBeDefined();
        expect(e.message).toEqual('Invalid credentials');
      }
    });

    it('Se senha for invalida deve retornar erro', async () => {
      try {
        await userService.login({
          email: 'teste@teste.com',
          password: '1233',
        });
      } catch (e) {
        expect(e).toBeDefined();
        expect(e.message).toEqual('Invalid credentials');
      }
    });

    it('Deve logar', async () => {
      const result = await userService.login({
        email: 'teste@teste.com',
        password: '123',
      });

      expect(result).toBeDefined();
      expect(result.access_token).toBeDefined();
    });
  });
});
