/**
 * 토큰에서 사용자 정보 추출 요청 DTO
 */
export interface GetUserFromTokenRequestDto {
  accessToken: string;
}

/**
 * 토큰에서 사용자 정보 추출 응답 DTO
 */
export interface GetUserFromTokenResponseDto {
  success: boolean;
  userId?: string;
  loginId?: string;
  name?: string;
  nickname?: string;
  role?: string;
  error?: string;
}
