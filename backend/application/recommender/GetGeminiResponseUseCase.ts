import { GeminiRepository } from "../../domain/repositories/recommender/gemini";
import {
  GeminiRequest,
  GeminiResponse,
} from "../../domain/entities/recommender/gemini";
import {
  LocationInfo,
  WeatherInfo,
} from "../../domain/entities/recommender/weather";
import { RecommendedMovie } from "../../domain/entities/recommender/movie";

// UI 컴포넌트 상태 타입 (이 폴더 내에서만 사용)
export interface GeminiWeatherTestState {
  step: "location" | "weather" | "gemini" | "result" | "movies";
  location: LocationInfo | null;
  weather: WeatherInfo | null;
  geminiResponse: string | null;
  movieTitles: string[];
  movieResults: RecommendedMovie[];
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

  /**
   * AI 응답에서 영화 제목 목록을 추출합니다
   * @param aiResponse AI에서 받은 응답 텍스트
   * @returns 영화 제목 배열
   */
  parseMovieTitlesFromResponse(aiResponse: string): string[] {
    try {
      // 대괄호 안의 내용을 찾는 정규표현식
      const bracketMatch = aiResponse.match(/\[([^\]]+)\]/);

      if (!bracketMatch) {
        // 대괄호가 없는 경우 줄 단위로 영화 제목 추출 시도
        const lines = aiResponse.split("\n");
        const movieTitles: string[] = [];

        for (const line of lines) {
          const trimmedLine = line.trim();
          // 숫자로 시작하는 줄이나 "- " 로 시작하는 줄에서 영화 제목 추출
          const numberMatch = trimmedLine.match(/^\d+\.\s*(.+)/);
          const dashMatch = trimmedLine.match(/^-\s*(.+)/);

          if (numberMatch) {
            movieTitles.push(numberMatch[1].trim());
          } else if (dashMatch) {
            movieTitles.push(dashMatch[1].trim());
          }
        }

        return movieTitles.length > 0 ? movieTitles : [];
      }

      // 대괄호 안의 내용을 쉼표로 분리
      const movieTitles = bracketMatch[1]
        .split(",")
        .map((title) => title.trim())
        .filter((title) => title.length > 0);

      return movieTitles;
    } catch (error) {
      console.error("영화 제목 파싱 중 오류:", error);
      return [];
    }
  }

  /**
   * 추출된 영화 제목들을 정리합니다 (특수문자 제거, 공백 정리)
   * @param movieTitles 원본 영화 제목 배열
   * @returns 정리된 영화 제목 배열
   */
  cleanMovieTitles(movieTitles: string[]): string[] {
    return movieTitles
      .map((title) => {
        // 따옴표, 괄호 내용 제거, 앞뒤 공백 제거
        return title
          .replace(/["""'']/g, "") // 따옴표 제거
          .replace(/\([^)]*\)/g, "") // 괄호와 괄호 안 내용 제거
          .replace(/\[[^\]]*\]/g, "") // 대괄호와 대괄호 안 내용 제거
          .trim();
      })
      .filter((title) => title.length > 0);
  }

  /**
   * AI 응답에서 영화 제목을 추출하고 정리하는 통합 메서드
   * @param aiResponse AI에서 받은 응답 텍스트
   * @returns 정리된 영화 제목 배열
   */
  extractMovieTitles(aiResponse: string): string[] {
    const rawTitles = this.parseMovieTitlesFromResponse(aiResponse);
    return this.cleanMovieTitles(rawTitles);
  }
}
