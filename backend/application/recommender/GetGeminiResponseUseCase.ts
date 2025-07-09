import { GeminiRepository } from "../../domain/repositories/recommender/gemini";
import {
  GeminiRequest,
  GeminiResponse,
} from "../../domain/entities/recommender/gemini";
import {
  LocationInfo,
  WeatherInfo,
} from "../../domain/entities/recommender/weather";

// UI 컴포넌트 상태 타입 (이 폴더 내에서만 사용)
export interface GeminiWeatherTestState {
  step: "location" | "weather" | "gemini" | "result";
  location: LocationInfo | null;
  weather: WeatherInfo | null;
  geminiResponse: string | null;
  loading: boolean;
  error: string | null;
}

// Gemini 응답 서비스 클래스
export class GeminiService {
  private geminiRepository: GeminiRepository;

  constructor(geminiRepository: GeminiRepository) {
    this.geminiRepository = geminiRepository;
  }

  /**
   * Gemini 모델에 프롬프트를 전송하고 응답을 받아옵니다
   * @param prompt 사용자 프롬프트
   * @param temperature 생성 온도 (0.0 ~ 1.0, 기본값: 0.7)
   * @param max_tokens 최대 토큰 수 (기본값: 1000)
   * @returns Gemini 생성 결과
   */
  async generateResponse(
    prompt: string,
    temperature: number = 0.7,
    max_tokens: number = 1000
  ): Promise<GeminiResponse> {
    try {
      // 입력 검증
      if (!prompt || prompt.trim().length === 0) {
        return {
          success: false,
          error: "프롬프트가 비어있습니다.",
          timestamp: new Date().toISOString(),
        };
      }

      // 온도 값 범위 검증
      if (temperature < 0.0 || temperature > 1.0) {
        return {
          success: false,
          error: "온도 값은 0.0과 1.0 사이여야 합니다.",
          timestamp: new Date().toISOString(),
        };
      }

      // 최대 토큰 수 검증
      if (max_tokens < 1 || max_tokens > 4096) {
        return {
          success: false,
          error: "최대 토큰 수는 1과 4096 사이여야 합니다.",
          timestamp: new Date().toISOString(),
        };
      }

      // Gemini 요청 객체 생성
      const geminiRequest: GeminiRequest = {
        prompt: prompt.trim(),
        temperature,
        max_tokens,
      };

      // 리포지토리를 통해 Gemini 응답 생성
      const result = await this.geminiRepository.generateText(geminiRequest);

      return result;
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Gemini 응답 생성 중 오류가 발생했습니다.",
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * 현재 온도에 대한 간단한 질문을 생성합니다
   * @returns 온도 질문 프롬프트
   */
  generateTemperatureQuestion(): string {
    return "현재 온도는 얼마인가요?";
  }

  /**
   * 날씨 정보를 바탕으로 Gemini에게 질문할 프롬프트를 생성합니다
   * @returns 날씨 기반 프롬프트
   */
  generateWeatherBasedPrompt(): string {
    // 일단 기본 프롬프트 반환 (날씨 정보 연동 전)
    return "현재 날씨는 어떤가요? 온도와 날씨 상태를 알려주세요.";
  }

  /**
   * 날씨 정보를 바탕으로 영화 추천 프롬프트를 생성합니다
   * @param weather 날씨 정보
   * @returns 영화 추천 프롬프트
   */
  generateMovieRecommendationPrompt(weather: WeatherInfo): string {
    const temp = weather.currentTemp ? `${weather.currentTemp}°C` : "정보 없음";
    const humidity = weather.humidity ? `${weather.humidity}%` : "정보 없음";
    const feelsLike = weather.feelsLikeTemp
      ? `${weather.feelsLikeTemp}°C`
      : "정보 없음";

    return `현재온도와 습도, 체감온도는 현재온도: ${temp}, 습도: ${humidity}, 체감온도: ${feelsLike}인데, 이것에 기반해서 영화 추천해줘. 그리고 추천한 이유에 대해 각각 설명하지말고 전체적인 이유를 2~3줄로 짧게 설명해. 리스트는 10개까지만. 그리고 응답 형태는 다음같이 말해
[영화제목1, 영화제목2, 영화제목3, 영화제목4, 영화제목5, 영화제목6, 영화제목7, 영화제목8, 영화제목9, 영화제목10]`;
  }
}
