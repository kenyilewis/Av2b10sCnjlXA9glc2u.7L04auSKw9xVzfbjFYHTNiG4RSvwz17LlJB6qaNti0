import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/modules/app/app.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('NewsfeedController (e2e)', () => {
  let app: INestApplication;
  let mongod: MongoMemoryServer;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, MongooseModule.forRoot(uri)],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await mongod.stop();
  });

  it('/newsfeed (POST)', () => {
    return request(app.getHttpServer())
      .post('/newsfeed')
      .send({
        title: 'Test Newsfeed',
        content: 'This is a test content',
        author: 'Test Author',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body.title).toEqual('Test Newsfeed');
        expect(res.body.content).toEqual('This is a test content');
        expect(res.body.author).toEqual('Test Author');
      });
  });

  it('/newsfeed (GET)', () => {
    return request(app.getHttpServer())
      .get('/newsfeed')
      .expect(200)
      .expect((res) => {
        expect(res.body).toBeInstanceOf(Array);
      });
  });

  it('/newsfeed/:id (GET)', async () => {
    const res = await request(app.getHttpServer()).post('/newsfeed').send({
      title: 'Test Newsfeed',
      content: 'This is a test content',
      author: 'Test Author',
    });
    const id = res.body.id;

    return request(app.getHttpServer())
      .get(`/newsfeed/${id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toEqual(id);
        expect(res.body.title).toEqual('Test Newsfeed');
        expect(res.body.content).toEqual('This is a test content');
        expect(res.body.author).toEqual('Test Author');
      });
  });

  it('/newsfeed/:id (PUT)', async () => {
    const res = await request(app.getHttpServer()).post('/newsfeed').send({
      title: 'Test Newsfeed',
      content: 'This is a test content',
      author: 'Test Author',
    });
    const id = res.body.id;

    return request(app.getHttpServer())
      .put(`/newsfeed/${id}`)
      .send({
        title: 'Updated Newsfeed',
        content: 'Updated content',
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toEqual(id);
        expect(res.body.title).toEqual('Updated Newsfeed');
        expect(res.body.content).toEqual('Updated content');
      });
  });

  it('/newsfeed/:id (DELETE)', async () => {
    const res = await request(app.getHttpServer()).post('/newsfeed').send({
      title: 'Test Newsfeed',
      content: 'This is a test content',
      author: 'Test Author',
    });
    const id = res.body.id;

    return request(app.getHttpServer())
      .delete(`/newsfeed/${id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toEqual(id);
      });
  });
});
