import { User } from './user';

export interface UserRepository {
  userEmailExists(email: string): Promise<User | null>;
  createUser(user: User): Promise<User>;
  updateUser(user: User): Promise<User>;
  findById(id: string): Promise<User | null>;
}
