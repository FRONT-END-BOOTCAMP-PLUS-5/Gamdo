import { UserAuthRepository } from "../../domain/repositories/saves/UserAuthRepository";
import {
  UserAuth,
  TokenVerificationResult,
} from "../../domain/entities/saves/UserAuth";

/**
 * 사용자 인증 리포지토리 구현체
 */
export class UserAuthRepositoryImpl implements UserAuthRepository {
  /**
   * 쿠키에서 토큰을 추출하고 검증하여 사용자 인증 정보 반환
   */
  verifyTokenFromCookie(cookieValue: string): TokenVerificationResult {
    try {
      if (!cookieValue) {
        return {
          success: false,
          error: "토큰이 존재하지 않습니다.",
        };
      }

      // JWT 토큰 구조 검증
      const tokenParts = cookieValue.split(".");
      if (tokenParts.length !== 3) {
        return {
          success: false,
          error: "잘못된 토큰 형식입니다.",
        };
      }

      // 페이로드 디코딩
      const payloadStr = this.safeBase64Decode(tokenParts[1]);
      const payload = JSON.parse(payloadStr);

      // 필수 필드 검증
      if (!payload.userId || !payload.loginId || !payload.name) {
        return {
          success: false,
          error: "토큰에 필수 정보가 누락되었습니다.",
        };
      }

      // 토큰 만료 검증
      const currentTime = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < currentTime) {
        return {
          success: false,
          error: "토큰이 만료되었습니다.",
        };
      }

      // 사용자 인증 정보 생성
      const userAuth: UserAuth = {
        userId: payload.userId,
        loginId: payload.loginId,
        name: payload.name,
        nickname: payload.nickname || "",
        role: payload.role || "user",
        issuedAt: payload.iat || 0,
        expiresAt: payload.exp || 0,
      };

      return {
        success: true,
        userAuth,
      };
    } catch {
      return {
        success: false,
        error: "토큰 검증 중 오류가 발생했습니다.",
      };
    }
  }

  /**
   * UTF-8 Base64를 안전하게 디코딩하는 함수
   */
  private safeBase64Decode(str: string): string {
    try {
      return decodeURIComponent(escape(atob(str)));
    } catch {
      return atob(str);
    }
  }
}
