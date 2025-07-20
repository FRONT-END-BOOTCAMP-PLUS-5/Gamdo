import { UpdateUserInfoDto } from "@/backend/application/user/dtos/UpdateUserInfoDto";
import { User } from "../entities/User";

export interface UserRepository {
  isEmailExists(loginId: string): Promise<boolean>;
  isNicknameExists(nickname: string): Promise<boolean>;
  createUser(user: User): Promise<User>;
  getUserByLoginId(loginId: string): Promise<User | null>;
  getUserByUserId(userId: string): Promise<User | null>;
  updateUserInfo(userInfo: UpdateUserInfoDto): Promise<User | null>;
}
