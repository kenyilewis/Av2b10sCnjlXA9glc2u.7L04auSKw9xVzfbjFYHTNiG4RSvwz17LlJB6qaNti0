import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { UserService } from '../../src/modules/user/application/user.service';
import {
  CreateUserDto,
  UpdateUserDto,
} from '../../src/modules/user/application/dto';
import { UserRepository } from '../../src/modules/user/infrastructure/persistence/mongo-db/user.repository';
import { User } from '../../src/modules/user/domain/user';
import { Roles } from '../../src/modules/common/enums/roles.enum';

jest.mock('bcrypt');

describe('UserService', () => {
  let service: UserService;
  let repository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: 'UserRepository',
          useValue: {
            userEmailExists: jest.fn(),
            createUser: jest.fn(),
            findById: jest.fn(),
            updateUser: jest.fn(),
            findUserToAuth: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<UserRepository>('UserRepository');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should throw a conflict exception if user already exists', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@test.com',
        password: '123456',
        username: 'user test',
      };

      jest.spyOn(repository, 'userEmailExists').mockResolvedValue(
        new User({
          ...createUserDto,
          id: '66804f0ad7b7ccf5af91c2ab',
          password: bcrypt.hashSync('123456', 10),
          roles: [Roles.USER],
        }),
      );

      await expect(service.createUser(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should create and return a user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@test.com',
        password: '123456',
        username: 'test',
      };

      jest.spyOn(repository, 'userEmailExists').mockResolvedValue(null);
      jest.spyOn(repository, 'createUser').mockResolvedValue(
        new User({
          ...createUserDto,
          id: '66804f0ad7b7ccf5af91c2ab',
          password: bcrypt.hashSync('123456', 10),
          roles: [Roles.USER],
        }),
      );

      const result = await service.createUser(createUserDto);
      expect(result).toEqual(
        expect.objectContaining({ email: 'test@test.com', username: 'test' }),
      );
    });
  });

  describe('updateUser', () => {
    it('should throw a not found exception if user does not exist', async () => {
      const updateUserDto: UpdateUserDto = {
        email: 'updated@test.com',
        password: '12345678',
        username: 'updateduser',
      };

      const reqUser = {
        roles: [Roles.ADMIN],
        id: '66804f0ad7b7ccf5af91c2ab',
      };

      jest.spyOn(repository, 'findById').mockResolvedValue(null);

      await expect(
        service.updateUser('66804f0ad7b7ccf5af91c2ab', updateUserDto, reqUser),
      ).rejects.toThrow(NotFoundException);
    });

    it('should update and return a user', async () => {
      const updateUserDto: UpdateUserDto = {
        email: 'updated@test.com',
        password: '12345678',
        username: 'updateduser',
      };
      const existingUser = new User({
        email: 'test@test.com',
        password: '123456',
        username: 'testuser',
        id: '66804f0ad7b7ccf5af91c2ab',
        roles: [Roles.ADMIN],
      });

      const newUser = new User({
        email: 'updated@test.com',
        password: '12345678',
        username: 'updateduser',
        id: '66804f0ad7b7ccf5af91c2ab',

      });

      const reqUser = {
        roles: [Roles.ADMIN],
        id: '66804f0ad7b7ccf5af91c2ab',
      };

      jest.spyOn(repository, 'findById').mockResolvedValue(existingUser);
      jest.spyOn(repository, 'updateUser').mockResolvedValue(newUser);

      const result = await service.updateUser(
        '66804f0ad7b7ccf5af91c2ab',
        updateUserDto,
        reqUser,
      );
      expect(result).toEqual(
        expect.objectContaining({
          email: 'updated@test.com',
          username: 'updateduser',
        }),
      );
    });
  });

  describe('getUserById', () => {
    it('should throw a not found exception if user does not exist', async () => {
      jest.spyOn(repository, 'findById').mockResolvedValue(null);

      await expect(
        service.getUserById('66804f0ad7b7ccf5af91c2ab'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should return a user by ID', async () => {
      const existingUser = {
        email: 'test@test.com',
        username: 'testuser',
        id: '66804f0ad7b7ccf5af91c2ac',
        password: '123456',
        roles: [Roles.USER],
      };

      jest
        .spyOn(repository, 'findById')
        .mockResolvedValue(new User(existingUser));

      const result = await service.getUserById('66804f0ad7b7ccf5af91c2ac');
      delete existingUser.password;
      expect(result).toEqual(existingUser);
    });
  });

  describe('deleteUser', () => {
    it('should throw a not found exception if user does not exist', async () => {
      const reqUser = {
        roles: [Roles.ADMIN],
        id: '66804f0ad7b7ccf5af91c2ab',
      };

      jest.spyOn(repository, 'findById').mockResolvedValue(null);

      await expect(
        service.deleteUser('66804f0ad7b7ccf5af91c2ab', reqUser),
      ).rejects.toThrow(NotFoundException);
    });

    it('should delete a user', async () => {
      const existingUser = new User({
        email: 'test@test.com',
        password: '123456',
        username: 'testuser',
        id: '66804f0ad7b7ccf5af91c2ab',
      });
      const reqUser = {
        roles: [Roles.ADMIN],
        id: '66804f0ad7b7ccf5af91c2ab',
      };

      jest.spyOn(repository, 'findById').mockResolvedValue(existingUser);
      existingUser.delete();
      jest.spyOn(repository, 'updateUser').mockResolvedValue(existingUser);

      await expect(
        service.deleteUser('66804f0ad7b7ccf5af91c2ab', reqUser),
      ).resolves.toBeUndefined();
    });
  });
});
