import { User } from "../entities/User";

export interface UserRepository {
  isLoginIdDuplicated(login_id: string): Promise<boolean>;
  createUser(user: User): Promise<User>;
}
