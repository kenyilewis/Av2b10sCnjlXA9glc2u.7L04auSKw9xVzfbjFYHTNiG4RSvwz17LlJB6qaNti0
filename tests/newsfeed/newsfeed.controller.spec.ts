import { Test, TestingModule } from '@nestjs/testing';
import { NewsfeedController } from '../../src/modules/newsfeed/infrastructure/newsfeed.controller';
import { NewsfeedService } from '../../src/modules/newsfeed/application/newsfeed.service';
import { CreateNewsfeedDto } from '../../src/modules/newsfeed/application/dto/create-newsfeed.dto';
import { UpdateNewsfeedDto } from '../../src/modules/newsfeed/application/dto/update-newsfeed.dto';
import { JwtAuthGuard } from '../../src/modules/auth/guards/jwt.auth.guard';
import { RolesGuard } from '../../src/modules/auth/guards/roles.guard';
import { Roles } from '../../src/modules/common/enums/roles.enum';

describe('NewsfeedController', () => {
  let controller: NewsfeedController;
  let service: NewsfeedService;

  const mockNewsfeedService = {
    create: jest.fn(dto => ({ id: '1', ...dto })),
    findAll: jest.fn().mockResolvedValue([{ id: '1', title: 'Test', content: 'Test content', author: 'Author' }]),
    findOne: jest.fn(id => ({ id, title: 'Test', content: 'Test content', author: 'Author' })),
    update: jest.fn((id, dto) => ({ id, ...dto })),
    remove: jest.fn(id => ({ id })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NewsfeedController],
      providers: [
        NewsfeedService,
        { provide: JwtAuthGuard, useValue: jest.fn() },
        { provide: RolesGuard, useValue: jest.fn() },
        { provide: NewsfeedService, useValue: mockNewsfeedService },
      ],
    }).compile();

    controller = module.get<NewsfeedController>(NewsfeedController);
    service = module.get<NewsfeedService>(NewsfeedService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a newsfeed', async () => {
    const dto: CreateNewsfeedDto = { title: 'Test', content: 'Test content', author: 'Author' };
    expect(await controller.create(dto)).toEqual({
      id: expect.any(String),
      ...dto,
    });
    expect(mockNewsfeedService.create).toHaveBeenCalledWith(dto);
  });

  it('should get all newsfeeds', async () => {
    expect(await controller.findAll(1, 10)).toEqual([{ id: '1', title: 'Test', content: 'Test content', author: 'Author' }]);
    expect(mockNewsfeedService.findAll).toHaveBeenCalled();
  });

  it('should get a newsfeed by id', async () => {
    expect(await controller.findOne('1')).toEqual({ id: '1', title: 'Test', content: 'Test content', author: 'Author' });
    expect(mockNewsfeedService.findOne).toHaveBeenCalledWith('1');
  });

  it('should update a newsfeed', async () => {
    const dto: UpdateNewsfeedDto = { title: 'Updated title', content: 'Updated content' };
    expect(await controller.update('1', dto)).toEqual({
      id: '1',
      ...dto,
    });
    expect(mockNewsfeedService.update).toHaveBeenCalledWith('1', dto);
  });

  it('should delete a newsfeed', async () => {
    expect(await controller.remove('1')).toEqual({ id: '1' });
    expect(mockNewsfeedService.remove).toHaveBeenCalledWith('1');
  });
});
