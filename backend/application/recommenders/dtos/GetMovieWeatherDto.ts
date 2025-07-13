import { ParsedWeatherInfo } from "../../../domain/entities/recommenders/weather";

/**
 * 영화 추천용 날씨 정보 요청 DTO
 */
export interface GetMovieWeatherRequestDto {
  nx: number; // X 좌표 (격자)
  ny: number; // Y 좌표 (격자)
}

/**
 * 영화 추천용 날씨 정보 응답 DTO
 */
export interface GetMovieWeatherResponseDto {
  success: boolean;
  data?: ParsedWeatherInfo;
  error?: string;
  timestamp: string;
}

/**
 * 날씨 정보 API 응답 DTO (프론트엔드용)
 */
export interface WeatherApiResponseDto {
  success: boolean;
  weatherInfo?: ParsedWeatherInfo;
  error?: string;
  timestamp: string;
  message?: string;
}
