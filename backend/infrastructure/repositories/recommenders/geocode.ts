import { GeocodeRepository } from "../../../domain/repositories/recommenders/geocode";
import {
  GeocodeRequest,
  GeocodeResponse,
  GeocodeInfo,
  AddressInfo,
} from "../../../domain/entities/recommenders/geocode";

/**
 * 지오코딩 Repository 구현체
 * 좌표 범위를 기반으로 서울 지역 추정을 수행합니다
 *
 * 실제 운영 환경에서는 Kakao Map API나 Google Maps API 등을 사용하여
 * 정확한 주소 정보를 가져오는 것이 권장됩니다
 */
export class GeocodeRepositoryImpl implements GeocodeRepository {
  /**
   * 좌표를 주소로 변환 (역지오코딩)
   * @param request 좌표 정보
   * @returns 주소 정보 응답
   */
  async getAddressFromCoordinates(
    request: GeocodeRequest
  ): Promise<GeocodeResponse> {
    try {
      const { latitude, longitude } = request;

      // 좌표 유효성 검사
      if (
        latitude < -90 ||
        latitude > 90 ||
        longitude < -180 ||
        longitude > 180
      ) {
        return {
          success: false,
          error: "유효하지 않은 좌표입니다.",
          timestamp: new Date().toISOString(),
        };
      }

      // 좌표 기반 지역 추정
      const addressInfo = this.getLocationByCoordinates(latitude, longitude);

      const geocodeInfo: GeocodeInfo = {
        coordinates: {
          latitude,
          longitude,
        },
        address: addressInfo,
        timestamp: new Date().toISOString(),
      };

      return {
        success: true,
        data: geocodeInfo,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "역지오코딩 중 오류가 발생했습니다.",
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * 좌표를 기반으로 서울 지역을 추정합니다
   * @param latitude 위도
   * @param longitude 경도
   * @returns 주소 정보
   */
  private getLocationByCoordinates(
    latitude: number,
    longitude: number
  ): AddressInfo {
    // 서울 시내 주요 구역별 좌표 범위 (대략적)
    if (
      latitude >= 37.5 &&
      latitude <= 37.6 &&
      longitude >= 126.9 &&
      longitude <= 127.1
    ) {
      if (longitude <= 126.95) {
        return {
          sido: "서울특별시",
          sigungu: "마포구",
          dong: "홍대입구역",
          fullAddress: "서울특별시 마포구 홍대입구역",
        };
      } else if (longitude <= 127.0) {
        return {
          sido: "서울특별시",
          sigungu: "중구",
          dong: "명동",
          fullAddress: "서울특별시 중구 명동",
        };
      } else {
        return {
          sido: "서울특별시",
          sigungu: "강남구",
          dong: "역삼동",
          fullAddress: "서울특별시 강남구 역삼동",
        };
      }
    } else if (
      latitude >= 37.4 &&
      latitude <= 37.5 &&
      longitude >= 126.9 &&
      longitude <= 127.1
    ) {
      return {
        sido: "서울특별시",
        sigungu: "영등포구",
        dong: "여의도동",
        fullAddress: "서울특별시 영등포구 여의도동",
      };
    } else {
      // 기본값 (서울 이외 지역이거나 정확하지 않은 경우)
      return {
        sido: "서울특별시",
        sigungu: "중구",
        dong: "명동",
        fullAddress: "서울특별시 중구 명동",
      };
    }
  }
}
