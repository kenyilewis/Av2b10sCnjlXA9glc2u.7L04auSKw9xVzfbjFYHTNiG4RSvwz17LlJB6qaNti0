import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as request from 'supertest';

import { AuthModule, UserModule } from '../../src/modules';
import appConfig from '../../src/modules/config/config';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

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
      ],
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
      email: `testAuth${Math.floor(Math.random() * 10000)}@example.com`,
      password: '123456',
      username: `testAuth${Math.floor(Math.random() * 10000)}`,
    };

    await request(app.getHttpServer())
      .post('/users')
      .send(user)
      .expect(HttpStatus.CREATED);

    const loginDto = { email: user.email, password: user.password };

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(HttpStatus.CREATED);

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
      .expect(HttpStatus.UNAUTHORIZED);

    expect(response.body.message).toEqual('Invalid credentials');
  });
});
