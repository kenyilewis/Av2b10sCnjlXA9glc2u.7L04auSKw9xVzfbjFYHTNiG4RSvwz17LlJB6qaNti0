import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as request from 'supertest';

import { AuthModule, UserModule } from '../../src/modules';
import { Roles } from '../../src/modules/common/enums/roles.enum';
import appConfig from '../../src/modules/config/config';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let adminToken: string;
  let userId: string;

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

    const user = {
      email: `testAuth${Math.floor(Math.random() * 10000)}@example.com`,
      password: '123456',
      username: `testAuth${Math.floor(Math.random() * 10000)}`,
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
    userId = loginResponse.body.id;

    const adminLoginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: admin.email, password: admin.password })
      .expect(201);

    adminToken = adminLoginResponse.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/users/:id (GET) - get user by id (as user)', async () => {
    await request(app.getHttpServer())
      .get(`/users/${userId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty('id', userId);
      });
  });

  it('/users/:id (PUT) - update user by id (as user)', async () => {
    const updateUserDto = {
      email: `updateduser${Math.floor(Math.random() * 10000)}@test.com`,
      username: 'updateduser',
    };

    await request(app.getHttpServer())
      .put(`/users/${userId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updateUserDto)
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty('id', userId);
        expect(response.body).toHaveProperty('email', updateUserDto.email);
        expect(response.body).toHaveProperty(
          'username',
          updateUserDto.username,
        );
      });
  });

  it('/users/:id (PUT) - update user by id (as admin)', async () => {
    const updateUserDto = {
      email: `testUpdate${Math.floor(Math.random() * 10000)}@admin.com`,
      username: 'adminupdated',
    };
    console.log('adminToken', adminToken);
    await request(app.getHttpServer())
      .put(`/users/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(updateUserDto)
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty('id', userId);
        expect(response.body).toHaveProperty('email', updateUserDto.email);
        expect(response.body).toHaveProperty(
          'username',
          updateUserDto.username,
        );
      });
  });
});
