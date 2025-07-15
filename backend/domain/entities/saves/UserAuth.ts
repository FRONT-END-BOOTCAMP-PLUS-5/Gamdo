/**
 * 사용자 인증 정보 엔티티
 */
export interface UserAuth {
  userId: string;
  loginId: string;
  name: string;
  nickname: string;
  role: string;
  issuedAt: number;
  expiresAt: number;
}

/**
 * 토큰 검증 결과 타입
 */
export type TokenVerificationResult =
  | {
      success: true;
      userAuth: UserAuth;
    }
  | {
      success: false;
      error: string;
    };
