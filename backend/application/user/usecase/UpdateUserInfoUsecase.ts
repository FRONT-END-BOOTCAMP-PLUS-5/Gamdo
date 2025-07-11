import { User } from "@/backend/domain/entities/User";
import { UserRepository } from "@/backend/domain/repositories/UserRepository";
import { UpdateUserInfoDto } from "../dtos/UpdateUserInfoDto";
import { validatePassword, validateNickname } from "@/utils/validation";
import { hashPassword } from "@/utils/hash";

export class UpdateUserInfoUsecase {
  constructor(private userRepository: UserRepository) {}

  async execute(
    userId: string,
    nickname: string,
    password: string
  ): Promise<User> {
    if (!validatePassword(password)) {
      throw new Error(
        "비밀번호는 8자 이상의 숫자, 영어, 특수문자를 조합하여 입력해주세요."
      );
    }
    if (!validateNickname(nickname)) {
      throw new Error(
        "닉네임은 8자 이내 한글, 영어, 숫자, 특수문자만 입력할 수 있습니다."
      );
    }

    const isDuplicate = await this.userRepository.isNicknameExists(nickname);
    if (isDuplicate) {
      throw new Error("이미 사용 중인 닉네임입니다.");
    }

    const hashedPassword = await hashPassword(password);
    const userInfo = new UpdateUserInfoDto(userId, nickname, hashedPassword);
    const user = await this.userRepository.updateUserInfo(userInfo);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }
}
