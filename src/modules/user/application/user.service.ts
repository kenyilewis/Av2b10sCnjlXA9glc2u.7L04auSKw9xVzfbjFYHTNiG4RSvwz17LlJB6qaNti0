import { ConflictException, Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';


import { CreateUserDto, UpdateUserDto } from './dto';
import { User } from '../domain/user';
import { UserRepository } from '../domain/user.repository';

@Injectable()
export class UserService {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, name } = createUserDto;
    const existingUser = await this.userRepository.emailExists(email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      password: hashedPassword,
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return this.userRepository.createUser(user);
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
//   async execute(createUserDto: CreateUserDto): Promise<User> {
//     const { email, password } = createUserDto;
//
//     const existingUser = await this.userRepository.emailExists(email);
//     if (existingUser) {
//       throw new ConflictException('User already exists');
//     }
//
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = new User({
//       email,
//       password: hashedPassword,
//       status: UserStatus.ACTIVE,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     });
//
//     return this.userRepository.create(user);
//   }
// }
