// backend/application/usecases/SignupUseCase.ts
import { UserRepository } from "../../../domain/repositories/UserRepository";
import { SignupRequestDto, SignupResponseDto } from "../dtos/SignupDto";
import { User } from "../../../domain/entities/User";

export class SignupUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(dto: SignupRequestDto): Promise<SignupResponseDto> {
    // 1. 이메일 중복 체크
    const isDuplicated = await this.userRepository.isLoginIdDuplicated(
      dto.login_id
    );
    if (isDuplicated) {
      throw new Error("이미 사용 중인 이메일입니다.");
    }

    // 2. User 엔티티 생성
    const user = new User(
      dto.name,
      dto.login_id,
      dto.password, // 해싱 필요!
      dto.nickname ?? null,
      dto.profile_image ?? null,
      "user" // 우선은 role user 고정
    );

    // 3. DB에 저장
    const created = await this.userRepository.createUser(user);

    // 4. 응답 DTO로 변환
    return {
      name: created.name,
      login_id: created.login_id,
      nickname: created.nickname,
      profile_image: created.profile_image,
      role: created.role,
    };
  }
}
