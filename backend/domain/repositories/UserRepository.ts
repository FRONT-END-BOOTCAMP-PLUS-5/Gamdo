import { User } from "../entities/User";

export interface UserRepository {
  isEmailExists(login_id: string): Promise<boolean>;
  isNicknameExists(nickname: string): Promise<boolean>;
  createUser(user: User): Promise<User>;
}
