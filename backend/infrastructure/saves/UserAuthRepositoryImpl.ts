import { UserAuthRepository } from "../../domain/repositories/saves/UserAuthRepository";
import {
  UserAuth,
  TokenVerificationResult,
} from "../../domain/entities/saves/UserAuth";
import { verifyAccessToken } from "../../common/auth/jwt";
import { supabase } from "../../../utils/supabase/client";
import jwt from "jsonwebtoken";

/**
 * 사용자 인증 리포지토리 구현체
 */
export class UserAuthRepositoryImpl implements UserAuthRepository {
  /**
   * 쿠키에서 토큰을 추출하고 검증하여 사용자 인증 정보 반환
   */
  async verifyTokenFromCookie(
    cookieValue: string
  ): Promise<TokenVerificationResult> {
    try {
      if (!cookieValue) {
        return {
          success: false,
          error: "토큰이 존재하지 않습니다.",
        };
      }

      // JWT 토큰 검증
      let payload: jwt.JwtPayload;
      try {
        payload = verifyAccessToken(cookieValue) as jwt.JwtPayload;
      } catch (error) {
        return {
          success: false,
          error: `${error}유효하지 않은 토큰입니다.`,
        };
      }

      // userId 필수 검증
      if (!payload.userId) {
        return {
          success: false,
          error: "토큰에 사용자 ID가 누락되었습니다.",
        };
      }

      // 데이터베이스에서 사용자 정보 조회
      const { data: userData, error: dbError } = await supabase
        .from("users")
        .select("user_id, login_id, name, nickname, role")
        .eq("user_id", payload.userId)
        .single();

      if (dbError || !userData) {
        return {
          success: false,
          error: "사용자 정보를 찾을 수 없습니다.",
        };
      }

      // 사용자 인증 정보 생성
      const userAuth: UserAuth = {
        userId: userData.user_id,
        loginId: userData.login_id,
        name: userData.name,
        nickname: userData.nickname || "",
        role: userData.role || "user",
        issuedAt: payload.iat || 0,
        expiresAt: payload.exp || 0,
      };

      return {
        success: true,
        userAuth,
      };
    } catch (error) {
      return {
        success: false,
        error: `${error}토큰 검증 중 오류가 발생했습니다.`,
      };
    }
  }
}
