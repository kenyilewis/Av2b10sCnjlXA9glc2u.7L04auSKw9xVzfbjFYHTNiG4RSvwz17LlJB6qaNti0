import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';

import { UserService } from '../../src/modules/user/application/user.service';
import { CreateUserDto } from '../../src/modules/user/application/dto';
import { UserDocument } from '../../src/modules/user/infrastructure/persistence/mongo-db/user.entity';
import { User } from '../../src/modules/user/domain/user';

describe('UserService', () => {
  let service: UserService;
  let repository: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(UserDocument.name),
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
    repository = module.get(getModelToken(UserDocument.name));
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
      jest.spyOn(repository, 'userEmailExists').mockResolvedValue(true);

      await expect(service.createUser(createUserDto)).rejects.toThrow(
        'User already exists',
      );
    });

    it('should create and return a user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@test.com',
        password: '123456',
        username: 'test',
      };
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      jest.spyOn(repository, 'userEmailExists').mockResolvedValue(false);
      jest.spyOn(repository, 'createUser').mockResolvedValue(
        new User({
          id: '66804f0ad7b7ccf5af91c2ab',
          ...createUserDto,
          password: 'hashed',
        }),
      );

      const result = await service.createUser(createUserDto);
      expect(result).toEqual(
        expect.objectContaining({ email: 'test@test.com', username: 'test' }),
      );
    });
  });

  // Agregar más tests para otros métodos del servicio...
});
