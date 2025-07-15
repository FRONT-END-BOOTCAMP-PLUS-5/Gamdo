import { UserAuthRepository } from "../../../domain/repositories/saves/UserAuthRepository";
import {
  GetUserFromTokenRequestDto,
  GetUserFromTokenResponseDto,
} from "../dtos/GetUserFromTokenDto";

/**
 * 토큰에서 사용자 정보 추출 UseCase
 */
export class GetUserFromTokenUseCase {
  constructor(private userAuthRepository: UserAuthRepository) {}

  /**
   * 토큰에서 사용자 정보 추출 실행
   */
  async execute(
    request: GetUserFromTokenRequestDto
  ): Promise<GetUserFromTokenResponseDto> {
    const { accessToken } = request;

    if (!accessToken) {
      return {
        success: false,
        error: "토큰이 필요합니다.",
      };
    }

    // 리포지토리를 통해 토큰 검증
    const result = await this.userAuthRepository.verifyTokenFromCookie(
      accessToken
    );

    if (!result.success) {
      return {
        success: false,
        error: result.error,
      };
    }

    // 성공적으로 토큰 검증 완료
    const { userAuth } = result;

    return {
      success: true,
      userId: userAuth.userId,
      loginId: userAuth.loginId,
      name: userAuth.name,
      nickname: userAuth.nickname,
      role: userAuth.role,
    };
  }
}
