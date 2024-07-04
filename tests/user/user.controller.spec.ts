import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { UserController } from '../../src/modules/user/infrastructure/user.controller';
import { UserService } from '../../src/modules/user/application/user.service';
import {
  CreateUserDto,
  UpdateUserDto,
  ResponseUserDto,
} from '../../src/modules/user/application/dto';
import { RolesGuard } from '../../src/modules/auth/guards/roles.guard';
import { Roles } from '../../src/modules/common/enums/roles.enum';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            createUser: jest.fn(),
            updateUser: jest.fn(),
            getUserById: jest.fn(),
            deleteUser: jest.fn(),
          },
        },
        JwtService,
        Reflector,
        RolesGuard,
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@test.com',
        password: '123456',
        username: 'testuser',
      };
      const responseUserDto: ResponseUserDto = {
        id: '66804f0ad7b7ccf5af91c2ab',
        email: 'test@test.com',
        username: 'testuser',
        roles: [Roles.USER],
      };

      jest.spyOn(service, 'createUser').mockResolvedValue(responseUserDto);

      const result = await controller.createUser(createUserDto);
      expect(result).toEqual(responseUserDto);
    });

    it('should throw an error if user creation fails', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@test.com',
        password: '123456',
        username: 'testuser',
      };

      jest
        .spyOn(service, 'createUser')
        .mockRejectedValue(
          new HttpException('Error creating user', HttpStatus.BAD_REQUEST),
        );

      await expect(controller.createUser(createUserDto)).rejects.toThrow(
        'Error creating user',
      );
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = {
        email: 'updated@test.com',
        password: '12345678',
        username: 'updateduser',
      };
      const responseUserDto: ResponseUserDto = {
        id: '66804f0ad7b7ccf5af91c2ab',
        email: 'updated@test.com',
        username: 'updateduser',
        roles: [Roles.USER],
      };
      const reqUser = {
        roles: [Roles.USER],
        id: '66804f0ad7b7ccf5af91c2ab',
      };

      jest.spyOn(service, 'updateUser').mockResolvedValue(responseUserDto);

      const result = await controller.updateUser(
        '66804f0ad7b7ccf5af91c2ab',
        updateUserDto,
        reqUser,
      );
      expect(result).toEqual(responseUserDto);
    });

    it('should throw an error if user update fails', async () => {
      const updateUserDto: UpdateUserDto = {
        email: 'updated@test.com',
        password: '12345678',
        username: 'updateduser',
      };
      const reqUser = {
        roles: [Roles.USER],
        id: '66804f0ad7b7ccf5af91c2ab',
      };

      jest
        .spyOn(service, 'updateUser')
        .mockRejectedValue(
          new HttpException('Error updating user', HttpStatus.BAD_REQUEST),
        );

      await expect(
        controller.updateUser(
          '66804f0ad7b7ccf5af91c2ab',
          updateUserDto,
          reqUser,
        ),
      ).rejects.toThrow('Error updating user');
    });
  });

  describe('getUserById', () => {
    it('should return a user by ID', async () => {
      const responseUserDto: ResponseUserDto = {
        id: '66804f0ad7b7ccf5af91c2ab',
        email: 'test@test.com',
        username: 'testuser',
        roles: [Roles.USER],
      };
      const reqUser = {
        roles: [Roles.USER],
        id: '66804f0ad7b7ccf5af91c2ab',
      };

      jest.spyOn(service, 'getUserById').mockResolvedValue(responseUserDto);

      const result = await controller.getUserById(
        '66804f0ad7b7ccf5af91c2ab',
        reqUser,
      );
      expect(result).toEqual(responseUserDto);
    });

    it('should throw an error if user is not found', async () => {
      const reqUser = {
        roles: [Roles.USER],
        id: '66804f0ad7b7ccf5af91c2ab',
      };

      jest
        .spyOn(service, 'getUserById')
        .mockRejectedValue(
          new HttpException('User not found', HttpStatus.BAD_REQUEST),
        );

      await expect(
        controller.getUserById('66804f0ad7b7ccf5af91c2ab', reqUser),
      ).rejects.toThrow('User not found');
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      const reqUser = {
        roles: [Roles.USER],
        id: '66804f0ad7b7ccf5af91c2ab',
      };

      jest.spyOn(service, 'deleteUser').mockResolvedValue(undefined);

      const result = await controller.deleteUser(
        '66804f0ad7b7ccf5af91c2ab',
        reqUser,
      );
      expect(result).toEqual({ message: 'User deleted successfully' });
    });

    it('should throw an error if user deletion fails', async () => {
      const reqUser = {
        roles: [Roles.USER],
        id: '66804f0ad7b7ccf5af91c2ab',
      };

      jest
        .spyOn(service, 'deleteUser')
        .mockRejectedValue(
          new HttpException('Error deleting user', HttpStatus.BAD_REQUEST),
        );

      await expect(
        controller.deleteUser('66804f0ad7b7ccf5af91c2ab', reqUser),
      ).rejects.toThrow('Error deleting user');
    });
  });
});
