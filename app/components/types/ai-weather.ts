// 위치 정보 타입
export interface LocationInfo {
  latitude: number;
  longitude: number;
  nx: number; // 기상청 격자 X 좌표
  ny: number; // 기상청 격자 Y 좌표
}

// 날씨 정보 타입 (API 응답 기반)
export interface WeatherInfo {
  skyCondition: string; // 하늘 상태
  precipitationType: string; // 강수 형태
  weatherDescription: string; // 전체 날씨 설명
  currentTemp: number | null; // 현재 온도
  maxTemp: number | null; // 최고 온도
  minTemp: number | null; // 최저 온도
  feelsLikeTemp: number | null; // 체감 온도
  humidity: number | null; // 습도
  precipitation: string; // 강수량
  windSpeed: number | null; // 풍속
  forecastTime: string; // 예보 시간
  location: {
    nx: number;
    ny: number;
  };
}

// 날씨 API 응답 타입
export interface WeatherApiResponse {
  success: boolean;
  weatherInfo?: WeatherInfo;
  timestamp: string;
  message?: string;
  error?: string;
}

// AI 응답 타입
export interface AiApiResponse {
  success: boolean;
  data?: {
    text: string;
    tokens_used?: number;
    model?: string;
  };
  error?: string;
  timestamp: string;
}

// 컴포넌트 상태 타입
export interface AiWeatherTestState {
  step: "location" | "weather" | "ai" | "result";
  location: LocationInfo | null;
  weather: WeatherInfo | null;
  aiResponse: string | null;
  loading: boolean;
  error: string | null;
}
