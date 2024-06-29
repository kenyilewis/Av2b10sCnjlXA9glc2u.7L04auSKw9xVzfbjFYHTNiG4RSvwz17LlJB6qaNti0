import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { UserRepository } from '../domain/user.repository';
import { CreateUserDto, UpdateUserDto, ResponseUserDto } from './dto';
import { User } from '../domain/user';

@Injectable()
export class UserService {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<ResponseUserDto> {
    const { email, password, username } = createUserDto;
    const existingUser = await this.userRepository.userEmailExists(email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    const createdUser = await this.userRepository.createUser(user);
    return this.toResponseDto(createdUser);
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<ResponseUserDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { email, password, username } = updateUserDto;
    if (email) {
      const existingUser = await this.userRepository.userEmailExists(email);
      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('Email already in use');
      }

      user.updateEmail(email);
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.updatePassword(hashedPassword);
    }

    if (username) {
      user.updateUsername(username);
    }

    const updatedUser = await this.userRepository.updateUser(user);
    return this.toResponseDto(updatedUser);
  }

  async getUserById(id: string): Promise<ResponseUserDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.toResponseDto(user);
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    user.delete();
    await this.userRepository.updateUser(user);
  }

  async findUserToAuth(email: string): Promise<User> {
    return this.userRepository.findUserToAuth(email);
  }

  private toResponseDto(user: User): ResponseUserDto {
    return new ResponseUserDto(user);
  }
}
