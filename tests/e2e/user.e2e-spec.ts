import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../src/modules/app/app.module';
import { CreateUserDto } from '../../src/modules/user/application/dto';

describe('UserController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/users (POST) - create user', async () => {
    const createUserDto: CreateUserDto = {
      email: 'test@example.com',
      password: '123456',
      username: 'testuser',
    };
    return request(app.getHttpServer())
      .post('/users')
      .send(createUserDto)
      .expect(201)
      .then((response) => {
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('email', 'test@example.com');
        expect(response.body).toHaveProperty('username', 'testuser');
      });
  });

  it('/users/:id (GET) - get user by id', async () => {
    const createUserDto: CreateUserDto = {
      email: 'getuser@example.com',
      password: '123456',
      username: 'getuser',
    };
    const { body: createdUser } = await request(app.getHttpServer())
      .post('/users')
      .send(createUserDto)
      .expect(201);

    return request(app.getHttpServer())
      .get(`/users/${createdUser.id}`)
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty('id', createdUser.id);
        expect(response.body).toHaveProperty('email', 'getuser@example.com');
        expect(response.body).toHaveProperty('username', 'getuser');
      });
  });

  // Añadir más pruebas E2E para actualizar y eliminar usuarios

  afterAll(async () => {
    await app.close();
  });
});
