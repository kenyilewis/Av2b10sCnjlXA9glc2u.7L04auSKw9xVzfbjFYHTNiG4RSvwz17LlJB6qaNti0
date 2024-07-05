import { Test, TestingModule } from '@nestjs/testing';
import { NewsfeedService } from '../../src/modules/newsfeed/application/newsfeed.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NewsfeedDocument } from '../../src/modules/newsfeed/infrastructure/persistence/mongo-db/newsfeed.entity';
import { CreateNewsfeedDto } from '../../src/modules/newsfeed/application/dto/create-newsfeed.dto';
import { UpdateNewsfeedDto } from '../../src/modules/newsfeed/application/dto/update-newsfeed.dto';

const mockNewsfeed = (
  id: string,
  title = 'Test title',
  content = 'Test content',
  author = 'Test author',
) => ({
  id,
  title,
  content,
  author,
  createdAt: new Date(),
  updatedAt: new Date(),
  isDeleted: false,
});

describe('NewsfeedService', () => {
  let service: NewsfeedService;
  let model: Model<NewsfeedDocument>;

  const mockNewsfeedModel = {
    new: jest.fn(),
    constructor: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndRemove: jest.fn(),
    exec: jest.fn(),
    countDocuments: jest.fn(),
    skip: jest.fn(),
    limit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NewsfeedService,
        {
          provide: getModelToken('Newsfeed'),
          useValue: mockNewsfeedModel,
        },
      ],
    }).compile();

    service = module.get<NewsfeedService>(NewsfeedService);
    model = module.get<Model<NewsfeedDocument>>(getModelToken('Newsfeed'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a newsfeed', async () => {
    const dto: CreateNewsfeedDto = { title: 'Test', content: 'Test content', author: 'Author' };
    const result = mockNewsfeed('1');
    jest.spyOn(model, 'create').mockResolvedValueOnce(result as any);
    expect(await service.create(dto)).toEqual(result);
  });

  it('should return all newsfeeds', async () => {
    const result = [mockNewsfeed('1')];
    jest.spyOn(model, 'find').mockReturnValue({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(result),
      }),
    } as any);
    jest.spyOn(model, 'countDocuments').mockResolvedValueOnce(result.length);
    expect(await service.findAll({ page: 1, limit: 10 })).toEqual({ data: result, count: result.length });
  });

  it('should return a single newsfeed', async () => {
    const id = '1';
    const result = mockNewsfeed(id);
    jest.spyOn(model, 'findById').mockReturnValueOnce({
      exec: jest.fn().mockResolvedValueOnce(result),
    } as any);
    expect(await service.findOne(id)).toEqual(result);
  });

  it('should update a newsfeed', async () => {
    const id = '1';
    const dto: UpdateNewsfeedDto = { title: 'Updated title', content: 'Updated content' };
    const result = { ...mockNewsfeed(id), ...dto };
    jest.spyOn(model, 'findByIdAndUpdate').mockReturnValueOnce({
      exec: jest.fn().mockResolvedValueOnce(result),
    } as any);
    expect(await service.update(id, dto)).toEqual(result);
  });

  it('should remove a newsfeed', async () => {
    const id = '1';
    const result = mockNewsfeed(id);
    jest.spyOn(model, 'findByIdAndRemove').mockReturnValueOnce({
      exec: jest.fn().mockResolvedValueOnce(result),
    } as any);
    expect(await service.remove(id)).toEqual(undefined);
  });
});
