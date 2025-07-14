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

    // 디버깅을 위한 환경 변수 상태 로그
    console.log("🌤️ 환경 변수 확인:", {
      serviceKeyExists: !!serviceKey,
      baseUrlExists: !!baseUrl,
      serviceKeyLength: serviceKey?.length || 0,
      baseUrl: baseUrl || "없음",
    });

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

      // 디버깅을 위한 요청 정보 로그
      console.log("🌤️ 날씨 API 호출 시작:", {
        request,
        url: url.substring(0, 100) + "...", // URL 일부만 표시
        timestamp: new Date().toISOString(),
      });

      // 기상청 API 호출
      const response = await fetch(url);

      console.log("🌤️ 날씨 API 응답 상태:", {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries()),
      });

      if (!response.ok) {
        const errorMessage = `API 호출 실패: ${response.status} ${response.statusText}`;
        console.error("❌ 날씨 API 호출 실패:", errorMessage);
        return {
          success: false,
          error: errorMessage,
        };
      }

      // 응답 내용을 먼저 텍스트로 읽어서 확인
      const responseText = await response.text();

      console.log("🌤️ 날씨 API 응답 내용:", {
        length: responseText.length,
        preview: responseText.substring(0, 200) + "...",
        containsXML: responseText.includes("<OpenAPI_ServiceResponse>"),
        containsJSON: responseText.includes("{"),
      });

      // XML 에러 응답 체크
      if (responseText.includes("<OpenAPI_ServiceResponse>")) {
        // XML에서 에러 메시지 추출
        const errorMatch = responseText.match(
          /<returnAuthMsg>(.*?)<\/returnAuthMsg>/
        );
        const errorMessage = errorMatch ? errorMatch[1] : "알 수 없는 API 오류";

        console.error("❌ 기상청 API XML 오류:", {
          errorMessage,
          fullResponse: responseText,
        });

        return {
          success: false,
          error: `기상청 API 오류: ${errorMessage}`,
        };
      }

      // JSON 파싱 시도
      const data: WeatherData = JSON.parse(responseText);

      console.log("✅ 날씨 데이터 파싱 성공:", {
        hasResponse: !!data.response,
        hasBody: !!data.response?.body,
        hasItems: !!data.response?.body?.items,
        itemCount: data.response?.body?.items?.item?.length || 0,
      });

      return {
        success: true,
        data: data,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다";

      console.error("❌ 날씨 API 처리 오류:", {
        error: errorMessage,
        stack: error instanceof Error ? error.stack : undefined,
      });

      return {
        success: false,
        error: errorMessage,
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

    const fullUrl = `${this.baseUrl}?${params}`;

    console.log("🌤️ 생성된 API URL:", {
      baseUrl: this.baseUrl,
      params: params.replace(this.serviceKey, "***SERVICE_KEY***"), // 키 마스킹
      fullUrlLength: fullUrl.length,
    });

    return fullUrl;
  }
}
