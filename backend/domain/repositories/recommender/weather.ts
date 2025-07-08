import {
  WeatherRequest,
  WeatherResponse,
} from "../../entities/recommender/weather";

// 날씨 데이터 조회 리포지토리 인터페이스
export interface WeatherRepository {
  /**
   * 기상청 API에서 날씨 데이터를 조회합니다
   * @param request 날씨 조회 요청 파라미터
   * @returns 날씨 데이터 조회 결과
   */
  getWeatherData(request: WeatherRequest): Promise<WeatherResponse>;
}
