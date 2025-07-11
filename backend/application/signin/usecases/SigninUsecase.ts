import { UserRepository } from "../../../domain/repositories/UserRepository";
import {
  SigninRequestDto,
  SigninResponseDto,
  UserWithoutSensitive,
} from "../dtos/SigninDto";
import { validateEmail } from "@/utils/validation";
import { comparePassword } from "@/utils/hash";

export class SigninUsecase {
  constructor(private userRepository: UserRepository) {}

  async execute(data: SigninRequestDto): Promise<SigninResponseDto> {
    const { loginId, password } = data;

    if (!validateEmail(loginId)) {
      throw new Error("이메일 형식의 아이디만 입력할 수 있습니다.");
    }

    // 1. login_id로 유저 조회
    const user = await this.userRepository.getUserByLoginId(loginId);
    if (!user) {
      return { success: false, message: "존재하지 않는 아이디입니다." };
    }
    // 2. 비밀번호 비교
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return {
        success: false,
        message: "비밀번호가 일치하지 않습니다.",
      };
    }
    // 3. 로그인 성공
    const userWithoutSensitive: UserWithoutSensitive = {
      userId: user.userId,
      name: user.name,
      loginId: user.loginId,
      nickname: user.nickname,
      profileImage: user.profileImage,
      role: user.role,
    };

    return {
      success: true,
      message: "로그인 성공",
      user: userWithoutSensitive,
    };
  }
}
