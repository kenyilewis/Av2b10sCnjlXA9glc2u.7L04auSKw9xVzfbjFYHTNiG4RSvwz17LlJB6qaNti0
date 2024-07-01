import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../src/modules/auth/auth.controller';
import { AuthService } from '../../src/modules/auth/auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should login', async () => {
      const loginDto = {
        email: 'test@test.com',
        password: '123456',
      };
      const response = {
        accessToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjgyYzQwZjdjYmQ1Y2E4M2QwYzU5ODkiLCJlbWFpbCI6ImtlbnlpbGV3aXMwMUBnbWFpbC5jb20iLCJpYXQiOjE3MTk4NDU5MTIsImV4cCI6MTcxOTg0OTUxMn0.LfzyhpYUlejBUcpvHMHZ4qDr0U1eeVlBpwkZstg8vcs',
        email: 'test@test.com',
        password: '123456',
        id: '6682c40f7cbd5ca83d0c5989',
      };

      jest.spyOn(service, 'login').mockResolvedValue(response);

      const result = await controller.login(loginDto);
      expect(result).toEqual(response);
    });
  });
});
