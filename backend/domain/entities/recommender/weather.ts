// 위치 정보 타입
export interface LocationInfo {
  latitude: number;
  longitude: number;
  nx: number; // 기상청 격자 X 좌표
  ny: number; // 기상청 격자 Y 좌표
}

// 날씨 데이터 도메인 엔티티 정의
export interface WeatherData {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      items: {
        item: WeatherItem[];
      };
      pageNo: number;
      numOfRows: number;
      totalCount: number;
    };
  };
}

export interface WeatherItem {
  baseDate: string;
  baseTime: string;
  category: string;
  fcstDate?: string; // 예보 데이터에서만 사용
  fcstTime?: string; // 예보 데이터에서만 사용
  fcstValue?: string; // 예보 데이터에서만 사용
  obsrValue?: string; // 실황 데이터에서만 사용
  nx: number;
  ny: number;
}

// 날씨 조회 요청 파라미터 인터페이스
export interface WeatherRequest {
  baseDate: string;
  baseTime: string;
  nx: number;
  ny: number;
}

// 날씨 조회 응답 인터페이스
export interface WeatherResponse {
  success: boolean;
  data?: WeatherData;
  error?: string;
}

// ============== 파싱된 날씨 정보 ==============

// 날씨 정보 타입 (API 응답 기반)
export interface WeatherInfo {
  // 날씨 상태 정보
  skyCondition: string; // 하늘 상태 (맑음, 구름많음, 흐림)
  precipitationType: string; // 강수 형태 (없음, 비, 눈, 비/눈)
  weatherDescription: string; // 전체 날씨 설명

  // 온도 정보
  currentTemp: number | null; // 현재 온도 (°C)
  maxTemp: number | null; // 최고 온도 (°C)
  minTemp: number | null; // 최저 온도 (°C)
  feelsLikeTemp: number | null; // 체감 온도 (°C)

  // 기타 정보
  humidity: number | null; // 습도 (%)
  precipitation: string; // 강수량 (mm)
  windSpeed: number | null; // 풍속 (m/s)

  // 메타 정보
  forecastTime: string; // 예보 시간
  location: {
    nx: number;
    ny: number;
  };
}

// 파싱된 날씨 정보 인터페이스 (WeatherInfo의 별칭)
export type ParsedWeatherInfo = WeatherInfo;

// 파싱된 날씨 응답 인터페이스
export interface ParsedWeatherResponse {
  success: boolean;
  data?: ParsedWeatherInfo;
  error?: string;
  timestamp: string;
}

// 날씨 API 응답 타입
export interface WeatherApiResponse {
  success: boolean;
  weatherInfo?: WeatherInfo;
  timestamp: string;
  message?: string;
  error?: string;
}
