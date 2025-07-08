import { UserRepository } from "../../../domain/repositories/UserRepository";
import { SignupRequestDto, SignupResponseDto } from "../dtos/SignupDto";
import { User } from "../../../domain/entities/User";
import {
  validateName,
  validateEmail,
  validatePassword,
  validateNickname,
} from "../../../../utils/validation";
import bcrypt from "bcrypt";

export class CreateSignupUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(dto: SignupRequestDto): Promise<SignupResponseDto> {
    // 0. 유효성 검사
    if (!validateName(dto.name)) {
      throw new Error(
        "이름은 10자리 이내 한글, 영어, 숫자만 입력할 수 있습니다. (한글 자음/모음 분리 불가)"
      );
    }
    if (!validateEmail(dto.login_id)) {
      throw new Error("이메일 형식의 아이디만 입력할 수 있습니다.");
    }
    if (!validatePassword(dto.password)) {
      throw new Error(
        "비밀번호는 숫자, 영어, 특수문자를 조합하여 입력해주세요."
      );
    }
    if (!validateNickname(dto.nickname)) {
      throw new Error(
        "닉네임은 8자리 이내 한글, 영어, 숫자, 특수문자만 입력할 수 있습니다."
      );
    }

    // 1. 이메일 중복 체크
    const emailExists = await this.userRepository.isEmailExists(dto.login_id);
    if (emailExists) {
      throw new Error("이미 사용 중인 이메일입니다.");
    }

    // 2. 닉네임 중복 체크
    const nicknameExists = await this.userRepository.isNicknameExists(
      dto.nickname
    );
    if (nicknameExists) {
      throw new Error("이미 사용 중인 닉네임입니다.");
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // 2. User 엔티티 생성
    const user = new User(
      dto.name,
      dto.login_id,
      hashedPassword,
      dto.nickname,
      dto.profile_image ?? null,
      "user" // 우선은 role user 고정
    );

    // 3. DB에 저장
    const created = await this.userRepository.createUser(user);

    // 4. 응답 DTO로 변환
    return {
      user_id: created.user_id!,
      name: created.name,
      login_id: created.login_id,
      nickname: created.nickname,
      profile_image: created.profile_image,
      role: created.role,
      created_at: created.created_at!,
    };
  }
}
