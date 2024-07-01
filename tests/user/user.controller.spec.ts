import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../../src/modules/user/infrastructure/user.controller';
import { UserService } from '../../src/modules/user/application/user.service';
import { CreateUserDto } from '../../src/modules/user/application/dto';

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
      const responseUserDto = {
        id: '66804f0ad7b7ccf5af91c2ab',
        email: 'test@test.com',
        username: 'testuser',
      };
      jest.spyOn(service, 'createUser').mockResolvedValue(responseUserDto);

      const result = await controller.createUser(createUserDto);
      expect(result).toEqual(responseUserDto);
    });

    it('should throw an error if user creation fails', async () => {
      const createUserDto: CreateUserDto = { email: 'test@test.com', password: '123456', username: 'testuser' };
      jest
        .spyOn(service, 'createUser')
        .mockRejectedValue(new Error('User creation failed'));

      await expect(controller.createUser(createUserDto)).rejects.toThrow('User creation failed');
    });
  });

  // Agregar más tests para otros métodos del controlador...
});
