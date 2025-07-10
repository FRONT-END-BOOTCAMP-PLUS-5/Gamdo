import { User } from "../entities/User";

export interface UserRepository {
  isEmailExists(loginId: string): Promise<boolean>;
  isNicknameExists(nickname: string): Promise<boolean>;
  createUser(user: User): Promise<User>;
  getUserByLoginId(loginId: string): Promise<User | null>;
  getUserByUserId(userId: string): Promise<User | null>;
}
