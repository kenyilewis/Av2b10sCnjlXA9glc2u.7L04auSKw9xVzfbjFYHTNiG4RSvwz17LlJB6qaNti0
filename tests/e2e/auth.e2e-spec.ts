import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { ConfigService } from '@nestjs/config';
import { AppModule } from '../../src/modules/app/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/auth/login (POST) - success', async () => {
    const user = {
      email: `testAuht${Math.floor(Math.random() * 10000)}@example.com`,
      password: '123456',
      username: `testAuth${Math.floor(Math.random() * 10000)}`,
    };

    await request(app.getHttpServer()).post('/users').send(user).expect(201);

    const loginDto = { email: user.email, password: user.password };

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(200);

    expect(response.body).toHaveProperty('accessToken');
  });

  it('/auth/login (POST) - fail with invalid credentials', async () => {
    const loginDto = {
      email: 'nonexistent@test.com',
      password: 'wrongpassword',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(401);

    expect(response.body.message).toEqual('Invalid credentials');
  });
});
