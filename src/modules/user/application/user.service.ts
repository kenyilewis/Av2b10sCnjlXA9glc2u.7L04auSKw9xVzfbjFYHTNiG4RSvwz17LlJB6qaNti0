import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { IUserRepository } from '../domain/user.repository';
import { CreateUserDto, UpdateUserDto, ResponseUserDto } from './dto';
import { User } from '../domain/user';

@Injectable()
export class UserService {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<ResponseUserDto> {
    try {
      const { email, password, username } = createUserDto;
      await this.ensureUserDoesNotExist(email);

      const hashedPassword = await this.hashPassword(password);
      const user = new User({
        username,
        email,
        password: hashedPassword,
      });

      const createdUser = await this.userRepository.createUser(user);

      return this.toResponseDto(createdUser);
    } catch (error) {
      console.error('Error creating user', JSON.stringify(error));
      throw error || new InternalServerErrorException('Error creating user');
    }
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<ResponseUserDto> {
    try {
      const user = await this.userExists(id);
      const { email, password, username } = updateUserDto;
      if (email) {
        await this.ensureUserDoesNotExist(email);
        user.updateEmail(email);
      }

      if (password) {
        const hashedPassword = await this.hashPassword(password);
        user.updatePassword(hashedPassword);
      }

      if (username) {
        user.updateUsername(username);
      }

      const updatedUser = await this.userRepository.updateUser(user);

      return this.toResponseDto(updatedUser);
    } catch (error) {
      console.error('Error updating user', JSON.stringify(error));
      throw error || new InternalServerErrorException('Error updating user');
    }
  }

  async getUserById(id: string): Promise<ResponseUserDto> {
    try {
      const user = await this.userExists(id);

      return this.toResponseDto(user);
    } catch (error) {
      console.error('Error getting user', JSON.stringify(error));
      throw error || new InternalServerErrorException('Error getting user');
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      const user = await this.userExists(id);
      user.delete();
      await this.userRepository.updateUser(user);
    } catch (error) {
      console.error('Error deleting user', JSON.stringify(error));
      throw error || new InternalServerErrorException('Error deleting user');
    }
  }

  async findUserToAuth(email: string): Promise<User> {
    try {
      return this.userRepository.findUserToAuth(email);
    } catch (error) {
      console.error('Error finding user to auth', JSON.stringify(error));
      throw error || new InternalServerErrorException('Error finding user');
    }
  }

  private toResponseDto(user: User): ResponseUserDto {
    return new ResponseUserDto(user);
  }

  private async ensureUserDoesNotExist(email: string): Promise<void> {
    const existingUser = await this.userRepository.userEmailExists(email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }
  }

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  private async userExists(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
