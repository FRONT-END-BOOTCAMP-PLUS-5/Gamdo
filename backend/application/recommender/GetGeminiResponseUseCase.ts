import { GeminiRepository } from "../../domain/repositories/recommender/gemini";
import {
  GeminiRequest,
  GeminiResponse,
} from "../../domain/entities/recommender/gemini";
import { WeatherInfo } from "../../domain/entities/recommender/weather";

/**
 * 날씨 정보를 기반으로 영화 추천을 위한 Gemini 응답 생성 UseCase
 */
export class GetGeminiResponseUseCase {
  constructor(private geminiRepository: GeminiRepository) {}

  /**
   * 날씨 정보를 바탕으로 영화 추천 요청
   * @param weather 날씨 정보
   * @returns Gemini 응답 결과
   */
  async execute(weather: WeatherInfo): Promise<GeminiResponse> {
    try {
      const prompt = this.generateMovieRecommendationPrompt(weather);

      const request: GeminiRequest = {
        prompt,
        temperature: 0.7,
        max_tokens: 1000,
      };

      const result = await this.geminiRepository.generateText(request);
      return result;
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "영화 추천 생성 중 오류가 발생했습니다.",
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * 날씨 정보를 바탕으로 영화 추천 프롬프트 생성
   * @param weather 날씨 정보
   * @returns 영화 추천 프롬프트
   */
  private generateMovieRecommendationPrompt(weather: WeatherInfo): string {
    const temp = weather.currentTemp ? `${weather.currentTemp}°C` : "정보 없음";
    const humidity = weather.humidity ? `${weather.humidity}%` : "정보 없음";
    const feelsLike = weather.feelsLikeTemp
      ? `${weather.feelsLikeTemp}°C`
      : "정보 없음";

    return `현재온도: ${temp}, 습도: ${humidity}, 체감온도: ${feelsLike}인데, 이것에 기반해서 영화 추천해줘. 리스트는 10개까지만. 응답할 때 너의 사족은 필요없어. 그냥 영화 제목만 말하면 돼 다음과 같이 말해.
[영화제목1, 영화제목2, 영화제목3, 영화제목4, 영화제목5, 영화제목6, 영화제목7, 영화제목8, 영화제목9, 영화제목10]`;
  }

  /**
   * AI 응답에서 영화 제목 목록 추출
   * @param aiResponse AI 응답 텍스트
   * @returns 영화 제목 배열
   */
  extractMovieTitles(aiResponse: string): string[] {
    try {
      // 대괄호 안의 내용을 찾는 정규표현식
      const bracketMatch = aiResponse.match(/\[([^\]]+)\]/);

      if (!bracketMatch) {
        return [];
      }

      // 대괄호 안의 내용을 쉼표로 분리하고 정리
      const movieTitles = bracketMatch[1]
        .split(",")
        .map((title) => title.trim())
        .filter((title) => title.length > 0)
        .map((title) => title.replace(/["""'']/g, "").trim()); // 따옴표 제거

      return movieTitles;
    } catch (error) {
      console.error("영화 제목 파싱 중 오류:", error);
      return [];
    }
  }
}
