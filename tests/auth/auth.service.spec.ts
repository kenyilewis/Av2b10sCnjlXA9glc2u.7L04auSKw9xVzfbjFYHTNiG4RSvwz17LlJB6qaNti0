import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { UserService } from '../../src/modules/user/application/user.service';
import { AuthService } from '../../src/modules/auth/auth.service';
import { LoginDto } from '../../src/modules/auth/dto/login.dto';

jest.mock('bcrypt');

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;
  let bcryptCompare: jest.Mock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findUserToAuth: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);

    bcryptCompare = bcrypt.compare as jest.Mock;
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('login', () => {
    it('should throw an UnauthorizedException if user is not found', async () => {
      const loginDto: LoginDto = { email: 'test@test.com', password: '123456' };
      jest.spyOn(userService, 'findUserToAuth').mockResolvedValue(null);

      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw an UnauthorizedException if password is invalid', async () => {
      const loginDto: LoginDto = {
        email: 'test@test.com',
        password: 'avantio',
      };
      const user = {
        id: '66804f0ad7b7ccf5af91c2ab',
        email: 'test@test.com',
        password:
          '$2b$10$.S.TKwq5otK3mgUCqegDWet8oVPFwCoR8estPHJ8fd6knwuOuGFmi',
      };
      jest.spyOn(userService, 'findUserToAuth').mockResolvedValue(user);

      bcryptCompare.mockResolvedValue(false);
      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should return the user data and access token if credentials are valid', async () => {
      const loginDto: LoginDto = {
        email: 'test@test.com',
        password: 'avantio',
      };
      const user = {
        id: '66804f0ad7b7ccf5af91c2ab',
        email: 'test@test.com',
        password:
          '$2b$10$.S.TKwq5otK3mgUCqegDWet8oVPFwCoR8estPHJ8fd6knwuOuGFmi',
      };
      const token = 'fakeToken';
      jest.spyOn(userService, 'findUserToAuth').mockResolvedValue(user);
      jest.spyOn(jwtService, 'sign').mockReturnValue(token);
      bcryptCompare.mockResolvedValue(true);

      const result = await authService.login(loginDto);
      expect(result).toEqual({
        id: user.id,
        email: user.email,
        accessToken: token,
      });
    });
  });
});
