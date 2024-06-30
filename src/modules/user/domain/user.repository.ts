import { User } from './user';

export interface IUserRepository {
  userEmailExists(email: string): Promise<User | null>;
  createUser(user: User): Promise<User>;
  updateUser(user: User): Promise<User>;
  findById(id: string): Promise<User | null>;
  findUserToAuth(email: string): Promise<User | null>;
}
