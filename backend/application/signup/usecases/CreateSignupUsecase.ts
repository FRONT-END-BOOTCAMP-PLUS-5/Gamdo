import { UserRepository } from "../../../domain/repositories/UserRepository";
import { SignupRequestDto, SignupResponseDto } from "../dtos/SignupDto";
import { User } from "../../../domain/entities/User";

export class CreateSignupUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(dto: SignupRequestDto): Promise<SignupResponseDto> {
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
    // 2. User 엔티티 생성
    const user = new User(
      dto.name,
      dto.login_id,
      dto.password, // 해싱 필요!
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
