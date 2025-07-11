import { WeatherRepository } from "../../../domain/repositories/recommenders/weather";
import {
  WeatherRequest,
  WeatherResponse,
  WeatherData,
} from "../../../domain/entities/recommenders/weather";

// 기상청 API 리포지토리 구현체
export class WeatherRepositoryImpl implements WeatherRepository {
  private readonly serviceKey: string;
  private readonly baseUrl: string;

  constructor() {
    // 환경 변수에서 기상청 API 서비스 키 및 기본 URL 읽기
    const serviceKey = process.env.WEATHER_SERVICE_KEY;
    const baseUrl = process.env.WEATHER_BASE_URL;

    if (!serviceKey) {
      throw new Error("WEATHER_SERVICE_KEY 환경 변수가 설정되지 않았습니다");
    }

    if (!baseUrl) {
      throw new Error("WEATHER_BASE_URL 환경 변수가 설정되지 않았습니다");
    }

    // 기상청 API는 인코딩된 키를 그대로 사용해야 할 수도 있음
    this.serviceKey = serviceKey; // 디코딩하지 않고 그대로 사용
    this.baseUrl = baseUrl;
  }

  /**
   * 기상청 API에서 날씨 데이터를 조회합니다
   * @param request 날씨 조회 요청 파라미터
   * @returns 날씨 데이터 조회 결과
   */
  async getWeatherData(request: WeatherRequest): Promise<WeatherResponse> {
    try {
      // API 호출 URL 생성
      const url = this.buildApiUrl(request);

      // 기상청 API 호출
      const response = await fetch(url);

      if (!response.ok) {
        return {
          success: false,
          error: `API 호출 실패: ${response.status} ${response.statusText}`,
        };
      }

      // 응답 내용을 먼저 텍스트로 읽어서 확인
      const responseText = await response.text();

      // XML 에러 응답 체크
      if (responseText.includes("<OpenAPI_ServiceResponse>")) {
        // XML에서 에러 메시지 추출
        const errorMatch = responseText.match(
          /<returnAuthMsg>(.*?)<\/returnAuthMsg>/
        );
        const errorMessage = errorMatch ? errorMatch[1] : "알 수 없는 API 오류";

        return {
          success: false,
          error: `기상청 API 오류: ${errorMessage}`,
        };
      }

      // JSON 파싱 시도
      const data: WeatherData = JSON.parse(responseText);

      return {
        success: true,
        data: data,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "알 수 없는 오류가 발생했습니다",
      };
    }
  }

  /**
   * 기상청 API 호출 URL을 생성합니다
   * @param request 날씨 조회 요청 파라미터
   * @returns 완성된 API URL
   */
  private buildApiUrl(request: WeatherRequest): string {
    // 기상청 API 파라미터 구성 (더 많은 데이터를 위해 numOfRows=100)
    const params = [
      `serviceKey=${this.serviceKey}`,
      `pageNo=1`,
      `numOfRows=100`,
      `dataType=JSON`,
      `base_date=${request.baseDate}`,
      `base_time=${request.baseTime}`,
      `nx=${request.nx}`,
      `ny=${request.ny}`,
    ].join("&");

    return `${this.baseUrl}?${params}`;
  }
}
