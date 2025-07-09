import { UserRepository } from "../../../domain/repositories/UserRepository";
import bcrypt from "bcrypt";
import {
  SigninRequestDto,
  SigninResponseDto,
  UserWithoutSensitive,
} from "../dtos/SigninDto";
import { validateEmail } from "@/utils/validation";

export class SigninUsecase {
  constructor(private userRepository: UserRepository) {}

  async execute(data: SigninRequestDto): Promise<SigninResponseDto> {
    const { login_id, password } = data;

    if (!validateEmail(login_id)) {
      throw new Error("이메일 형식의 아이디만 입력할 수 있습니다.");
    }

    // 1. login_id로 유저 조회
    const user = await this.userRepository.getUserByLoginId(login_id);
    if (!user) {
      return { success: false, message: "존재하지 않는 아이디입니다." };
    }
    // 2. 비밀번호 비교
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return {
        success: false,
        message: "비밀번호가 일치하지 않습니다.",
      };
    }
    // 3. 로그인 성공
    const userWithoutSensitive: UserWithoutSensitive = {
      user_id: user.user_id,
      name: user.name,
      login_id: user.login_id,
      nickname: user.nickname,
      profile_image: user.profile_image,
      role: user.role,
    };

    return {
      success: true,
      message: "로그인 성공",
      user: userWithoutSensitive,
    };
  }
}
