import { convertToGrid } from "../../../utils/supabase/recommender/coordinate-converter";
import { LocationInfo } from "../../domain/entities/recommender/weather";

// 사용자 위치 정보 서비스 클래스
export class GetUserLocationService {
  /**
   * 브라우저에서 사용자의 현재 위치를 가져옵니다
   * @returns 위치 정보 (위도, 경도, 격자 좌표 포함)
   */
  async getCurrentLocation(): Promise<{
    success: boolean;
    data?: LocationInfo;
    error?: string;
  }> {
    try {
      // Geolocation API 지원 여부 확인
      if (!navigator.geolocation) {
        return {
          success: false,
          error: "브라우저에서 위치 정보를 지원하지 않습니다.",
        };
      }

      // 위치 정보 요청
      const position = await this.getPositionAsync();
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
      };
    } catch (error) {
      return {
        success: false,
        error: this.handleLocationError(error),
      };
    }
  }

  /**
   * Geolocation API를 Promise로 래핑합니다
   * @returns 위치 정보 Promise
   */
  private getPositionAsync(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true, // 정확도 높이기
        timeout: 10000, // 10초 제한
        maximumAge: 300000, // 5분간 캐시 사용
      });
    });
  }

  /**
   * 위치 정보 에러를 사용자 친화적 메시지로 변환합니다
   * @param error Geolocation 에러
   * @returns 사용자 친화적 에러 메시지
   */
  private handleLocationError(error: unknown): string {
    if (error instanceof GeolocationPositionError) {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          return "위치 정보 접근이 거부되었습니다. 브라우저 설정에서 위치 접근을 허용해주세요.";
        case error.POSITION_UNAVAILABLE:
          return "위치 정보를 사용할 수 없습니다. 잠시 후 다시 시도해주세요.";
        case error.TIMEOUT:
          return "위치 정보 요청 시간이 초과되었습니다. 다시 시도해주세요.";
        default:
          return "위치 정보를 가져오는 중 오류가 발생했습니다.";
      }
    }

    return error instanceof Error
      ? error.message
      : "위치 정보를 가져올 수 없습니다.";
  }

  /**
   * 위치 정보 권한 상태를 확인합니다
   * @returns 권한 상태 정보
   */
  async checkLocationPermission(): Promise<{
    granted: boolean;
    state?: PermissionState;
    error?: string;
  }> {
    try {
      if (!navigator.permissions) {
        return {
          granted: false,
          error: "권한 확인 API를 지원하지 않습니다.",
        };
      }

      const permission = await navigator.permissions.query({
        name: "geolocation",
      });

      return {
        granted: permission.state === "granted",
        state: permission.state,
      };
    } catch (err) {
      return {
        granted: false,
        error:
          err instanceof Error
            ? err.message
            : "권한 상태를 확인할 수 없습니다.",
      };
    }
  }
}

// 싱글톤 인스턴스 export
export const getUserLocationService = new GetUserLocationService();
