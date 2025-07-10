// 위치 정보 엔티티
export interface LocationInfo {
  latitude: number;
  longitude: number;
  nx: number; // 기상청 격자 X 좌표
  ny: number; // 기상청 격자 Y 좌표
}

// 날씨 정보 엔티티
export interface WeatherInfo {
  skyCondition: string; // 하늘 상태 (맑음, 구름많음, 흐림)
  precipitationType: string; // 강수 형태 (없음, 비, 눈, 비/눈)
  weatherDescription: string; // 전체 날씨 설명

  currentTemp: number | null; // 현재 온도 (°C)
  maxTemp: number | null; // 최고 온도 (°C)
  minTemp: number | null; // 최저 온도 (°C)
  feelsLikeTemp: number | null; // 체감 온도 (°C)

  humidity: number | null; // 습도 (%)
  precipitation: string; // 강수량 (mm)
  windSpeed: number | null; // 풍속 (m/s)

  forecastTime: string; // 예보 시간
  location: {
    nx: number;
    ny: number;
  };
}

// 날씨 조회 요청 DTO
export interface WeatherRequest {
  baseDate: string;
  baseTime: string;
  nx: number;
  ny: number;
}

// 날씨 조회 응답 DTO
export interface WeatherResponse {
  success: boolean;
  data?: WeatherData;
  error?: string;
}

// 기상청 API 원시 데이터 구조 (인프라 계층에서 사용)
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
  fcstDate?: string;
  fcstTime?: string;
  fcstValue?: string;
  obsrValue?: string;
  nx: number;
  ny: number;
}
