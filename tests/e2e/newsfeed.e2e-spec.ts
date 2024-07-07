import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as request from 'supertest';

import { AuthModule, UserModule, NewsfeedModule } from '../../src/modules';
import { Roles } from '../../src/modules/common/enums/roles.enum';
import appConfig from '../../src/modules/config/config';

describe('NewsfeedController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let adminToken: string;
  let newsfeedId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [appConfig],
          isGlobal: true,
        }),
        MongooseModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => ({
            uri: configService.get<string>('config.mongoDB.uri'),
          }),
        }),
        AuthModule,
        UserModule,
        NewsfeedModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    const user = {
      email: `testUser${Math.floor(Math.random() * 10000)}@example.com`,
      password: '123456',
      username: `testUser${Math.floor(Math.random() * 10000)}`,
      roles: [Roles.USER],
    };

    const admin = {
      email: `admin${Math.floor(Math.random() * 10000)}@admin.com`,
      password: 'admin123',
      username: `admin${Math.floor(Math.random() * 10000)}`,
      roles: [Roles.ADMIN],
    };

    await request(app.getHttpServer()).post('/users').send(user).expect(201);
    await request(app.getHttpServer()).post('/users').send(admin).expect(201);

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: user.email, password: user.password })
      .expect(201);

    authToken = loginResponse.body.accessToken;

    const adminLoginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: admin.email, password: admin.password })
      .expect(201);
    adminToken = adminLoginResponse.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/newsfeed (POST) - create newsfeed', async () => {
    const createNewsfeedDto = {
      title: 'Test Title',
      content: 'Test Content',
      url: 'http://test.com',
      image: 'http://test.com/image.jpg',
    };

    const response = await request(app.getHttpServer())
      .post('/newsfeed')
      .set('Authorization', `Bearer ${authToken}`)
      .send(createNewsfeedDto)
      .expect(HttpStatus.CREATED);

    expect(response.body).toHaveProperty(
      'message',
      'Newsfeed created successfully',
    );
  });

  it('/newsfeed (GET) - get all newsfeeds', async () => {
    const allnewsfeeds = await request(app.getHttpServer())
      .get('/newsfeed')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(HttpStatus.OK);

    expect(allnewsfeeds.body).toHaveProperty('results', expect.any(Array));
    expect(allnewsfeeds.body).toHaveProperty('page', 1);

    newsfeedId = allnewsfeeds.body.results[0]._id;
  });

  it('/newsfeed/:id (GET) - get newsfeed by id', async () => {
    await request(app.getHttpServer())
      .get(`/newsfeed/${newsfeedId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(HttpStatus.OK)
      .then((response) => {
        expect(response.body).toHaveProperty('id', newsfeedId);
      });
  });

  it('/newsfeed/:id (PUT) - update newsfeed by id', async () => {
    const updateNewsfeedDto = {
      title: 'Updated Title',
      content: 'Updated Content',
      url: 'http://updated.com',
      image: 'http://updated.com/image.jpg',
    };

    await request(app.getHttpServer())
      .put(`/newsfeed/${newsfeedId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updateNewsfeedDto)
      .expect(HttpStatus.OK)
      .then((response) => {
        expect(response.body).toHaveProperty('title', updateNewsfeedDto.title);
        expect(response.body).toHaveProperty(
          'content',
          updateNewsfeedDto.content,
        );
      });
  });

  it('/newsfeed/:id (DELETE) - delete newsfeed by id', async () => {
    await request(app.getHttpServer())
      .delete(`/newsfeed/${newsfeedId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(HttpStatus.OK)
      .then((response) => {
        expect(response.body).toHaveProperty(
          'message',
          'Newsfeed deleted successfully',
        );
      });
  });
});
