import {
  GeocodeRequest,
  GeocodeResponse,
} from "../../entities/recommenders/geocode";

/**
 * 지오코딩 Repository 인터페이스
 * 좌표를 주소로 변환하거나 주소를 좌표로 변환하는 기능을 제공
 */
export interface GeocodeRepository {
  /**
   * 좌표를 주소로 변환 (역지오코딩)
   * @param request 좌표 정보
   * @returns 주소 정보 응답
   */
  getAddressFromCoordinates(request: GeocodeRequest): Promise<GeocodeResponse>;
}
