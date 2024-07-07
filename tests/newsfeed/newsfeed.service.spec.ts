import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';

import { NewsfeedService } from '../../src/modules/newsfeed/application/newsfeed.service';
import { INewsfeedRepository } from '../../src/modules/newsfeed/domain/newsfeed.repository';
import { UserService } from '../../src/modules/user/application/user.service';
import {
  CreateNewsfeedDto,
  UpdateNewsfeedDto,
  ResponseNewsfeedDto,
} from '../../src/modules/newsfeed/application/dto';
import { Newsfeed } from '../../src/modules/newsfeed/domain/newsfeed';

describe('NewsfeedService', () => {
  let service: NewsfeedService;
  let repository: INewsfeedRepository;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NewsfeedService,
        {
          provide: 'NewsfeedRepository',
          useValue: {
            createNewsfeed: jest.fn(),
            findAllNewsfeed: jest.fn(),
            findOneNewsfeed: jest.fn(),
            updateNewsfeed: jest.fn(),
            deleteNewsfeed: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            getUserById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<NewsfeedService>(NewsfeedService);
    repository = module.get<INewsfeedRepository>('NewsfeedRepository');
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a newsfeed', async () => {
    const createNewsfeedDto: CreateNewsfeedDto = {
      title: 'Test Title',
      content: 'Test Content',
      url: 'http://test.com',
      image: 'http://test.com/image.jpg',
    };
    const authorId = 'test-author-id';
    userService.getUserById = jest.fn().mockResolvedValue(true);
    repository.createNewsfeed = jest.fn().mockResolvedValue(
      new Newsfeed({
        ...createNewsfeedDto,
        author: 'Test Author',
      }));

    await expect(
      service.createNewsfeed(createNewsfeedDto, authorId),
    ).resolves.not.toThrow();
    expect(userService.getUserById).toHaveBeenCalledWith(authorId);
    expect(repository.createNewsfeed).toHaveBeenCalled();
  });

  it('should get all newsfeeds', async () => {
    const options = { limit: 10, offset: 0 };
    const authorId = 'test-author-id';
    userService.getUserById = jest.fn().mockResolvedValue(true);
    repository.findAllNewsfeed = jest.fn().mockResolvedValue([]);

    await expect(service.findAllNewsfeed(options, authorId)).resolves.toEqual(
      [],
    );
    expect(userService.getUserById).toHaveBeenCalledWith(authorId);
    expect(repository.findAllNewsfeed).toHaveBeenCalled();
  });

  it('should get one newsfeed', async () => {
    const id = 'test-id';
    const authorId = 'test-author-id';
    const newsfeed = new Newsfeed({
      id,
      title: 'Test Title',
      content: 'Test Content',
      author: authorId,
    });
    userService.getUserById = jest.fn().mockResolvedValue(true);
    repository.findOneNewsfeed = jest.fn().mockResolvedValue(newsfeed);

    const result = await service.findOneNewsfeed(id, authorId);
    expect(result).toBeInstanceOf(ResponseNewsfeedDto);
    expect(userService.getUserById).toHaveBeenCalledWith(authorId);
    expect(repository.findOneNewsfeed).toHaveBeenCalledWith(id);
  });

  it('should update a newsfeed', async () => {
    const id = 'test-id';
    const authorId = 'test-author-id';
    const updateNewsfeedDto: UpdateNewsfeedDto = {
      title: 'Updated Title',
      content: 'Updated Content',
      url: 'http://updated.com',
      image: 'http://updated.com/image.jpg',
    };
    const newsfeed = new Newsfeed({
      id,
      title: 'Test Title',
      content: 'Test Content',
      author: authorId,
    });
    userService.getUserById = jest.fn().mockResolvedValue(true);
    repository.findOneNewsfeed = jest.fn().mockResolvedValue(newsfeed);
    repository.updateNewsfeed = jest.fn().mockResolvedValue(newsfeed);

    const result = await service.updateNewsfeed(
      id,
      updateNewsfeedDto,
      authorId,
    );
    expect(result).toBeInstanceOf(ResponseNewsfeedDto);
    expect(result.title).toBe(updateNewsfeedDto.title);
    expect(userService.getUserById).toHaveBeenCalledWith(authorId);
    expect(repository.findOneNewsfeed).toHaveBeenCalledWith(id);
    expect(repository.updateNewsfeed).toHaveBeenCalled();
  });

  it('should delete a newsfeed', async () => {
    const id = 'test-id';
    const authorId = 'test-author-id';
    const newsfeed = new Newsfeed({
      id,
      title: 'Test Title',
      content: 'Test Content',
      author: authorId,
    });
    userService.getUserById = jest.fn().mockResolvedValue(true);
    repository.findOneNewsfeed = jest.fn().mockResolvedValue(newsfeed);
    repository.deleteNewsfeed = jest.fn().mockResolvedValue(null);

    await expect(service.deleteNewsfeed(id, authorId)).resolves.not.toThrow();
    expect(userService.getUserById).toHaveBeenCalledWith(authorId);
    expect(repository.findOneNewsfeed).toHaveBeenCalledWith(id);
    expect(repository.deleteNewsfeed).toHaveBeenCalledWith(newsfeed);
  });
});
