import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, HttpException } from '@nestjs/common';

import { AuthController } from '../../src/modules/auth/auth.controller';
import { AuthService } from '../../src/modules/auth/auth.service';
import { LoginDto } from '../../src/modules/auth/dto/login.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
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

    authService = moduleFixture.get<AuthService>(AuthService);
    authController = moduleFixture.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('login', () => {
    it('should return an access token when login is successful', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: '123456',
      };
      const result = {
        accessToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjgyYzQwZjdjYmQ1Y2E4M2QwYzU5ODkiLCJlbWFpbCI6ImtlbnlpbGV3aXMwMUBnbWFpbC5jb20iLCJpYXQiOjE3MTk4NDU5MTIsImV4cCI6MTcxOTg0OTUxMn0.LfzyhpYUlejBUcpvHMHZ4qDr0U1eeVlBpwkZstg8vcs',
        email: 'test@example.com',
        id: '6682c40f7cbd5ca83d0c5989',
      };

      jest.spyOn(authService, 'login').mockResolvedValue(result);

      const response = await authController.login(loginDto);
      expect(response).toEqual({ ...result });
    });

    it('should throw an unauthorized exception when login fails', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      jest.spyOn(authService, 'login').mockImplementation(() => {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      });

      await expect(authController.login(loginDto)).rejects.toThrow(HttpException);
      await expect(authController.login(loginDto)).rejects.toThrowError(
        new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED),
      );
    });
  });
});
