import { LocationInfo } from "../../../domain/entities/recommenders/weather";

/**
 * 사용자 위치 정보 요청 DTO
 * (현재는 필요한 파라미터가 없지만 확장성을 위해 유지)
 */
export interface GetUserLocationRequestDto {
  // 향후 확장을 위한 필드들
  accuracy?: number; // 정확도 요구 사항
  timeout?: number; // 타임아웃 설정
}

/**
 * 사용자 위치 정보 응답 DTO
 */
export interface GetUserLocationResponseDto {
  success: boolean;
  data?: LocationInfo;
  error?: string;
  timestamp: string;
}

/**
 * 위치 권한 확인 응답 DTO
 */
export interface LocationPermissionResponseDto {
  granted: boolean;
  state?: PermissionState;
  error?: string;
  timestamp: string;
}
