import { GeocodeRepository } from "../../../domain/repositories/recommenders/geocode";
import {
  GetAddressFromCoordinatesRequestDto,
  GetAddressFromCoordinatesResponseDto,
} from "../dtos/GetAddressFromCoordinatesDto";

/**
 * 역지오코딩 UseCase
 * 좌표를 주소로 변환하는 비즈니스 로직을 처리합니다
 */
export class GetAddressFromCoordinatesUseCase {
  private geocodeRepository: GeocodeRepository;

  constructor(geocodeRepository: GeocodeRepository) {
    this.geocodeRepository = geocodeRepository;
  }

  /**
   * 좌표를 주소로 변환합니다
   * @param request 좌표 정보 요청 DTO
   * @returns 주소 정보 응답 DTO
   */
  async execute(
    request: GetAddressFromCoordinatesRequestDto
  ): Promise<GetAddressFromCoordinatesResponseDto> {
    try {
      // 입력값 유효성 검사
      if (!this.isValidCoordinates(request.latitude, request.longitude)) {
        return {
          success: false,
          error:
            "유효하지 않은 좌표입니다. 위도는 -90~90, 경도는 -180~180 범위여야 합니다.",
          timestamp: new Date().toISOString(),
        };
      }

      // Repository를 통해 역지오코딩 수행
      const result = await this.geocodeRepository.getAddressFromCoordinates({
        latitude: request.latitude,
        longitude: request.longitude,
      });

      if (!result.success || !result.data) {
        return {
          success: false,
          error: result.error || "주소를 찾을 수 없습니다.",
          timestamp: new Date().toISOString(),
        };
      }

      // 성공 응답
      return {
        success: true,
        data: result.data.address,
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
   * 좌표 유효성 검사
   * @param latitude 위도
   * @param longitude 경도
   * @returns 유효성 여부
   */
  private isValidCoordinates(latitude: number, longitude: number): boolean {
    return (
      typeof latitude === "number" &&
      typeof longitude === "number" &&
      !isNaN(latitude) &&
      !isNaN(longitude) &&
      latitude >= -90 &&
      latitude <= 90 &&
      longitude >= -180 &&
      longitude <= 180
    );
  }
}
