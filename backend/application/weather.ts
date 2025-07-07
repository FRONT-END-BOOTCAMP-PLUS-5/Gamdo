import { WeatherRepository } from "../domain/repositories/weather";
import {
  WeatherRequest,
  WeatherResponse,
  ParsedWeatherResponse,
  WeatherData,
  WeatherItem,
  ParsedWeatherInfo,
} from "../domain/entities/weather";

// 통합된 날씨 서비스 클래스 (비즈니스 로직 + 파싱)
export class WeatherService {
  private weatherRepository: WeatherRepository;

  constructor(weatherRepository: WeatherRepository) {
    this.weatherRepository = weatherRepository;
  }

  /**
   * 현재 날씨 정보를 조회합니다 (내부용 - 원시 데이터)
   * @param nx X좌표 (기본값: 60)
   * @param ny Y좌표 (기본값: 127)
   * @returns 날씨 데이터 조회 결과
   */
  private async getCurrentWeather(
    nx: number = 60,
    ny: number = 127
  ): Promise<WeatherResponse> {
    try {
      // 현재 날짜와 시간 계산
      const weatherRequest = this.createWeatherRequest(nx, ny);

      // 리포지토리를 통해 날씨 데이터 조회
      const result = await this.weatherRepository.getWeatherData(
        weatherRequest
      );

      return result;
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "날씨 정보 조회 중 오류가 발생했습니다",
      };
    }
  }

  /**
   * 현재 날씨 정보를 파싱된 형태로 조회합니다
   * @param nx X좌표 (기본값: 60)
   * @param ny Y좌표 (기본값: 127)
   * @returns 파싱된 날씨 데이터 조회 결과
   */
  async getCurrentWeatherParsed(
    nx: number = 60,
    ny: number = 127
  ): Promise<ParsedWeatherResponse> {
    try {
      // 원시 날씨 데이터 조회
      const rawWeatherResult = await this.getCurrentWeather(nx, ny);

      if (!rawWeatherResult.success || !rawWeatherResult.data) {
        return {
          success: false,
          error: rawWeatherResult.error || "날씨 데이터 조회에 실패했습니다",
          timestamp: new Date().toISOString(),
        };
      }

      // 파싱 서비스를 통해 데이터 변환
      const parsedResult = this.parseWeatherData(rawWeatherResult.data);

      return parsedResult;
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "파싱된 날씨 정보 조회 중 오류가 발생했습니다",
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * 현재 날짜와 시간을 기준으로 날씨 조회 요청을 생성합니다
   * @param nx X좌표
   * @param ny Y좌표
   * @returns 날씨 조회 요청 객체
   */
  private createWeatherRequest(nx: number, ny: number): WeatherRequest {
    const now = new Date();

    // 현재 시간에서 40분 전 시간 계산
    const targetTime = new Date(now.getTime() - 40 * 60 * 1000);
    console.log(
      `🕐 현재 시간: ${now.getHours()}:${now
        .getMinutes()
        .toString()
        .padStart(2, "0")}`
    );
    console.log(
      `🕐 40분 전 시간: ${targetTime.getHours()}:${targetTime
        .getMinutes()
        .toString()
        .padStart(2, "0")}`
    );

    // 기상청 API 날짜 형식으로 변환 (YYYYMMDD)
    const year = targetTime.getFullYear();
    const month = String(targetTime.getMonth() + 1).padStart(2, "0");
    const day = String(targetTime.getDate()).padStart(2, "0");
    const baseDate = `${year}${month}${day}`;

    // 30분 단위로 가장 가까운 시간 계산
    const baseTime = this.calculateBaseTime(targetTime);

    return {
      baseDate,
      baseTime,
      nx,
      ny,
    };
  }

  /**
   * 30분 단위로 가장 가까운 시간을 계산합니다
   * 예: 2시 31분 → 2시 30분, 2시 29분 → 2시 00분
   * @param targetTime 목표 시간
   * @returns 30분 단위로 내림차순 정렬된 시간 (HHMM 형식)
   */
  private calculateBaseTime(targetTime: Date): string {
    const hour = targetTime.getHours();
    const minute = targetTime.getMinutes();

    // 30분 단위로 내림차순 정렬
    const baseHour = hour;
    const baseMinute = minute >= 30 ? 30 : 0;

    // 시간과 분 형식 맞추기 (HHMM)
    const baseTime = `${baseHour.toString().padStart(2, "0")}${baseMinute
      .toString()
      .padStart(2, "0")}`;

    console.log(
      `🕐 계산된 기준 시간: ${baseHour}:${baseMinute
        .toString()
        .padStart(2, "0")} (${baseTime})`
    );

    return baseTime;
  }

  // ============== 날씨 데이터 파싱 메서드들 ==============

  /**
   * 기상청 API 원시 데이터를 사용자 친화적 형태로 파싱합니다
   * @param weatherData 기상청 API 응답 데이터
   * @returns 파싱된 날씨 정보
   */
  private parseWeatherData(weatherData: WeatherData): ParsedWeatherResponse {
    try {
      if (
        !weatherData.response.body.items.item ||
        weatherData.response.body.items.item.length === 0
      ) {
        return {
          success: false,
          error: "날씨 데이터가 없습니다",
          timestamp: new Date().toISOString(),
        };
      }

      const items = weatherData.response.body.items.item;
      console.log(`📊 받은 날씨 데이터 항목 수: ${items.length}`);

      // 데이터 카테고리별로 분류
      const weatherMap = this.categorizeWeatherData(items);

      // 파싱된 날씨 정보 생성
      const parsedWeather = this.createParsedWeatherInfo(weatherMap, items[0]);

      return {
        success: true,
        data: parsedWeather,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("날씨 데이터 파싱 중 오류:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "날씨 데이터 파싱 중 오류가 발생했습니다",
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * 날씨 데이터 항목들을 카테고리별로 분류합니다
   * @param items 날씨 데이터 항목들
   * @returns 카테고리별로 분류된 날씨 데이터 맵
   */
  private categorizeWeatherData(items: WeatherItem[]): Map<string, string> {
    const weatherMap = new Map<string, string>();

    items.forEach((item) => {
      // 실황 데이터(obsrValue)와 예보 데이터(fcstValue) 모두 처리
      const value = item.obsrValue || item.fcstValue || "N/A";
      weatherMap.set(item.category, value);
      console.log(`📋 ${item.category}: ${value}`);
    });

    return weatherMap;
  }

  /**
   * 분류된 날씨 데이터로 파싱된 날씨 정보를 생성합니다
   * @param weatherMap 카테고리별 날씨 데이터
   * @param firstItem 첫 번째 날씨 데이터 항목 (메타정보용)
   * @returns 파싱된 날씨 정보
   */
  private createParsedWeatherInfo(
    weatherMap: Map<string, string>,
    firstItem: WeatherItem
  ): ParsedWeatherInfo {
    console.log("🔍 카테고리별 데이터 확인:");
    weatherMap.forEach((value, key) => {
      console.log(`  ${key}: ${value}`);
    });

    // 하늘 상태 파싱 (SKY)
    const skyCondition = this.parseSkyCondition(weatherMap.get("SKY"));

    // 강수 형태 파싱 (PTY)
    const precipitationType = this.parsePrecipitationType(
      weatherMap.get("PTY")
    );

    // 전체 날씨 설명 생성
    const weatherDescription = this.generateWeatherDescription(
      skyCondition,
      precipitationType
    );

    // 온도 정보 파싱 (T1H - 기온)
    const currentTemp = this.parseTemperature(weatherMap.get("T1H"));

    // 실황 API에서는 최고/최저온도 정보가 없을 수 있음
    const maxTemp = null; // 실황 API에서는 제공되지 않음
    const minTemp = null; // 실황 API에서는 제공되지 않음

    // 기타 정보 파싱
    const humidity = this.parseHumidity(weatherMap.get("REH")); // 습도
    const precipitation = this.parsePrecipitation(weatherMap.get("RN1")); // 1시간 강수량
    const windSpeed = null; // 실황 API에서는 풍속 정보가 없을 수 있음

    // 체감온도 계산
    const feelsLikeTemp = this.calculateFeelsLikeTemp(
      currentTemp,
      humidity,
      windSpeed
    );

    return {
      skyCondition,
      precipitationType,
      weatherDescription,
      currentTemp,
      maxTemp,
      minTemp,
      feelsLikeTemp,
      humidity,
      precipitation,
      windSpeed,
      forecastTime: `${firstItem.fcstDate || firstItem.baseDate} ${
        firstItem.fcstTime || firstItem.baseTime
      }`,
      location: {
        nx: firstItem.nx,
        ny: firstItem.ny,
      },
    };
  }

  /**
   * 하늘 상태 코드를 텍스트로 변환합니다 (사용자 제공 정보 기반)
   * @param skyCode 하늘 상태 코드 (1:맑음, 3:구름많음, 4:흐림)
   * @returns 하늘 상태 텍스트
   */
  private parseSkyCondition(skyCode: string | undefined): string {
    switch (skyCode) {
      case "1":
        return "맑음";
      case "3":
        return "구름많음";
      case "4":
        return "흐림";
      default:
        return "알수없음";
    }
  }

  /**
   * 강수 형태 코드를 텍스트로 변환합니다 (사용자 제공 정보 기반)
   * @param ptyCode 강수 형태 코드
   * @returns 강수 형태 텍스트
   */
  private parsePrecipitationType(ptyCode: string | undefined): string {
    switch (ptyCode) {
      case "0":
        return "없음";
      case "1":
        return "비";
      case "2":
        return "비/눈";
      case "3":
        return "눈";
      case "5":
        return "빗방울";
      case "6":
        return "빗방울/눈날림";
      case "7":
        return "눈날림";
      default:
        return "알수없음";
    }
  }

  /**
   * 1시간 강수량(RN1)을 파싱합니다
   * @param precipitationStr 강수량 문자열
   * @returns 강수량 정보
   */
  private parsePrecipitation(precipitationStr: string | undefined): string {
    if (
      !precipitationStr ||
      precipitationStr === "0" ||
      precipitationStr === "0.0"
    ) {
      return "강수없음";
    }

    const precipitation = parseFloat(precipitationStr);
    if (isNaN(precipitation)) {
      return "측정불가";
    }

    return `${precipitation}mm`;
  }

  /**
   * 전체 날씨 설명을 생성합니다
   * @param skyCondition 하늘 상태
   * @param precipitationType 강수 형태
   * @returns 날씨 설명
   */
  private generateWeatherDescription(
    skyCondition: string,
    precipitationType: string
  ): string {
    if (precipitationType !== "없음") {
      return `${skyCondition}, ${precipitationType}`;
    }
    return skyCondition;
  }

  /**
   * 온도 문자열을 숫자로 변환합니다
   * @param tempStr 온도 문자열
   * @returns 온도 숫자 또는 null
   */
  private parseTemperature(tempStr: string | undefined): number | null {
    if (!tempStr) return null;
    const temp = parseFloat(tempStr);
    return isNaN(temp) ? null : temp;
  }

  /**
   * 습도 문자열을 숫자로 변환합니다
   * @param humidityStr 습도 문자열
   * @returns 습도 숫자 또는 null
   */
  private parseHumidity(humidityStr: string | undefined): number | null {
    if (!humidityStr) return null;
    const humidity = parseFloat(humidityStr);
    return isNaN(humidity) ? null : humidity;
  }

  /**
   * 풍속 문자열을 숫자로 변환합니다
   * @param windSpeedStr 풍속 문자열
   * @returns 풍속 숫자 또는 null
   */
  private parseWindSpeed(windSpeedStr: string | undefined): number | null {
    if (!windSpeedStr) return null;
    const windSpeed = parseFloat(windSpeedStr);
    return isNaN(windSpeed) ? null : windSpeed;
  }

  /**
   * 체감온도를 계산합니다 (Heat Index 기반)
   * @param temp 기온 (°C)
   * @param humidity 습도 (%)
   * @param windSpeed 풍속 (m/s)
   * @returns 체감온도 (°C) 또는 null
   */
  private calculateFeelsLikeTemp(
    temp: number | null,
    humidity: number | null,
    windSpeed: number | null
  ): number | null {
    if (!temp || !humidity) return null;

    // 간단한 체감온도 계산 공식 (Heat Index 기반)
    if (temp >= 27) {
      // 더운 날씨용 체감온도
      const heatIndex = temp + 0.3 * humidity - 0.7 * (windSpeed || 0) - 4;
      return Math.round(heatIndex * 10) / 10;
    } else if (temp <= 10) {
      // 추운 날씨용 체감온도 (Wind Chill)
      const windChill = temp - 0.2 * (windSpeed || 0) * (temp - 10);
      return Math.round(windChill * 10) / 10;
    } else {
      // 일반적인 날씨는 실제 온도와 비슷
      return temp;
    }
  }
}
