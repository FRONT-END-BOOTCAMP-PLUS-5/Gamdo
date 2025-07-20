import { convertToGrid } from "../../../../utils/supabase/recommenders/coordinate-converter";
import { LocationInfo } from "../../../domain/entities/recommenders/weather";
import {
  GetUserLocationRequestDto,
  GetUserLocationResponseDto,
  LocationPermissionResponseDto,
} from "../dtos/GetUserLocationDto";

/**
 * 사용자 위치 정보 UseCase
 * 브라우저 Geolocation API를 사용하여 사용자의 현재 위치를 가져옵니다
 */
export class GetUserLocationUseCase {
  /**
   * 사용자 위치 정보 요청 처리 (메인 메서드)
   * @param request 위치 정보 요청 DTO
   * @returns 위치 정보 응답 DTO
   */
  async execute(
    request: GetUserLocationRequestDto = {}
  ): Promise<GetUserLocationResponseDto> {
    try {
      // Geolocation API 지원 여부 확인
      if (!navigator.geolocation) {
        return {
          success: false,
          error: "브라우저에서 위치 정보를 지원하지 않습니다.",
          timestamp: new Date().toISOString(),
        };
      }

      // 위치 정보 요청
      const position = await this.getPositionAsync(request);
      const { latitude, longitude } = position.coords;

      // 격자 좌표 변환 (기상청 API용)
      const gridCoords = convertToGrid(latitude, longitude);

      const locationInfo: LocationInfo = {
        latitude,
        longitude,
        nx: gridCoords.nx,
        ny: gridCoords.ny,
      };

      return {
        success: true,
        data: locationInfo,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: this.handleLocationError(error),
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * 위치 권한 확인
   * @returns 위치 권한 확인 응답 DTO
   */
  async checkLocationPermission(): Promise<LocationPermissionResponseDto> {
    try {
      if (!navigator.permissions) {
        return {
          granted: false,
          error: "권한 API를 지원하지 않습니다.",
          timestamp: new Date().toISOString(),
        };
      }

      const permission = await navigator.permissions.query({
        name: "geolocation",
      });

      return {
        granted: permission.state === "granted",
        state: permission.state,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        granted: false,
        error: this.handleLocationError(error),
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Geolocation API를 Promise로 래핑
   * @param request 위치 정보 요청 DTO
   * @returns Promise<GeolocationPosition>
   */
  private getPositionAsync(
    request: GetUserLocationRequestDto
  ): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      const options: PositionOptions = {
        enableHighAccuracy: true,
        timeout: request.timeout || 10000,
        maximumAge: 0,
      };

      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
  }

  /**
   * 위치 정보 에러 핸들링
   * @param error 에러 객체
   * @returns 사용자 친화적인 에러 메시지
   */
  private handleLocationError(error: unknown): string {
    if (error instanceof GeolocationPositionError) {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          return "위치 정보 접근 권한이 거부되었습니다.";
        case error.POSITION_UNAVAILABLE:
          return "위치 정보를 사용할 수 없습니다.";
        case error.TIMEOUT:
          return "위치 정보 요청이 시간 초과되었습니다.";
        default:
          return "위치 정보를 가져오는 중 오류가 발생했습니다.";
      }
    }

    if (error instanceof Error) {
      return error.message;
    }

    return "알 수 없는 오류가 발생했습니다.";
  }
}

/**
 * 사용자 위치 정보 서비스 함수 (기존 코드 호환성을 위해 유지)
 */
export const getUserLocationService =
  async (): Promise<GetUserLocationResponseDto> => {
    const useCase = new GetUserLocationUseCase();
    return await useCase.execute();
  };
