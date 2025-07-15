import { TokenVerificationResult } from "../../entities/saves/UserAuth";

/**
 * 사용자 인증 리포지토리 인터페이스
 */
export interface UserAuthRepository {
  /**
   * 쿠키에서 토큰을 추출하고 검증하여 사용자 인증 정보 반환
   */
  verifyTokenFromCookie(cookieValue: string): Promise<TokenVerificationResult>;
}
