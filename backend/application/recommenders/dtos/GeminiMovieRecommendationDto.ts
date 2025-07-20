import {
  WeatherInfo,
  LocationInfo,
} from "../../../domain/entities/recommenders/weather";
import { RecommendedMovie } from "../../../domain/entities/recommenders/movie";

/**
 * 사용자 선택 정보 타입
 */
export type UserSelectionInfo = {
  [key: string]: string;
};

/**
 * Gemini 날씨 테스트 상태 타입 (UI 컴포넌트용)
 */
export interface GeminiWeatherTestState {
  step:
    | "location"
    | "weather"
    | "weather_complete"
    | "user_selection"
    | "gemini"
    | "result"
    | "movies";
  location: LocationInfo | null;
  weather: WeatherInfo | null;
  geminiResponse: string | null;
  movieTitles: string[];
  movieResults: RecommendedMovie[];
  loading: boolean;
  error: string | null;
}

/**
 * Gemini 영화 추천 요청 DTO
 */
export interface GeminiMovieRecommendationRequestDto {
  weather: WeatherInfo;
  userSelection: UserSelectionInfo;
  previousMovieTitles?: string[]; // 이전 추천 영화 목록 (중복 방지용)
  temperature?: number;
  max_tokens?: number;
}

/**
 * Gemini 영화 추천 응답 DTO
 */
export interface GeminiMovieRecommendationResponseDto {
  success: boolean;
  data?: {
    geminiResponse: string;
    movieTitles: string[];
    tokens_used?: number;
    model?: string;
  };
  error?: string;
  timestamp: string;
}

/**
 * Gemini 기본 응답 DTO
 */
export interface GeminiResponseDto {
  success: boolean;
  data?: {
    text: string;
    tokens_used?: number;
    model?: string;
  };
  error?: string;
  timestamp: string;
}

/**
 * Gemini 기본 요청 DTO
 */
export interface GeminiRequestDto {
  prompt: string;
  temperature?: number;
  max_tokens?: number;
}
