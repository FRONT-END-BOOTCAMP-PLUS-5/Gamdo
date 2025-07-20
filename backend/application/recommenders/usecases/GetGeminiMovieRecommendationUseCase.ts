import { GeminiRepository } from "../../../domain/repositories/recommenders/gemini";
import { WeatherInfo } from "../../../domain/entities/recommenders/weather";
import {
  GeminiMovieRecommendationRequestDto,
  GeminiMovieRecommendationResponseDto,
  GeminiRequestDto,
  GeminiResponseDto,
  UserSelectionInfo,
} from "../dtos/GeminiMovieRecommendationDto";

/**
 * Gemini 영화 추천 UseCase
 * 비즈니스 로직: 프롬프트 생성, Gemini 호출, 영화 제목 추출
 */
export class GetGeminiMovieRecommendationUseCase {
  private geminiRepository: GeminiRepository;

  constructor(geminiRepository: GeminiRepository) {
    this.geminiRepository = geminiRepository;
  }

  /**
   * 영화 추천 요청 처리 (메인 메서드)
   * @param request 영화 추천 요청 DTO
   * @returns 영화 추천 응답 DTO
   */
  async execute(
    request: GeminiMovieRecommendationRequestDto
  ): Promise<GeminiMovieRecommendationResponseDto> {
    try {
      // 1. 비즈니스 로직: 프롬프트 생성
      const prompt = this.generateEnhancedMovieRecommendationPrompt(
        request.weather,
        request.userSelection,
        request.previousMovieTitles || [] // 이전 영화 목록 전달
      );

      // 2. Gemini 응답 생성
      const geminiResult = await this.generateResponse({
        prompt,
        temperature: request.temperature || 0.7,
        max_tokens: request.max_tokens || 4096,
      });

      if (!geminiResult.success || !geminiResult.data?.text) {
        return {
          success: false,
          error: geminiResult.error || "Gemini 응답을 받을 수 없습니다.",
          timestamp: new Date().toISOString(),
        };
      }

      // 3. 비즈니스 로직: 영화 제목 추출
      const movieTitles = this.extractMovieTitles(geminiResult.data.text);

      return {
        success: true,
        data: {
          geminiResponse: geminiResult.data.text,
          movieTitles,
          tokens_used: geminiResult.data.tokens_used,
          model: geminiResult.data.model,
        },
        timestamp: new Date().toISOString(),
      };
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
   * 기본 Gemini 응답 생성
   * @param request 기본 요청 DTO
   * @returns 기본 응답 DTO
   */
  async generateResponse(
    request: GeminiRequestDto
  ): Promise<GeminiResponseDto> {
    try {
      const result = await this.geminiRepository.generateText({
        prompt: request.prompt,
        temperature: request.temperature || 0.7,
        max_tokens: request.max_tokens || 1000,
      });

      if (result.success && result.data) {
        return {
          success: true,
          data: {
            text: result.data.text,
            tokens_used: result.data.tokens_used,
            model: result.data.model,
          },
          timestamp: new Date().toISOString(),
        };
      } else {
        return {
          success: false,
          error: result.error || "Gemini 응답 생성 실패",
          timestamp: new Date().toISOString(),
        };
      }
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
   * 향상된 영화 추천 프롬프트 생성
   * @param weather 날씨 정보
   * @param userSelection 사용자 선택 정보
   * @returns 향상된 영화 추천 프롬프트
   */
  private generateEnhancedMovieRecommendationPrompt(
    weather: WeatherInfo,
    userSelection: UserSelectionInfo,
    previousMovieTitles: string[]
  ): string {
    const temp = weather.currentTemp ? `${weather.currentTemp}°C` : "정보 없음";
    const humidity = weather.humidity ? `${weather.humidity}%` : "정보 없음";
    const feelsLike = weather.feelsLikeTemp
      ? `${weather.feelsLikeTemp}°C`
      : "정보 없음";

    // 사용자 선택 정보를 텍스트로 변환
    const userPreferences = Object.entries(userSelection)
      .map(([categoryId, value]) => {
        // 카테고리 이름을 사용자 친화적으로 변환
        const categoryNames: { [key: string]: string } = {
          mood: "현재 기분",
          time: "시청 시간대",
          genre: "선호 장르",
          duration: "영화 길이", // 확장성을 위한 예시
        };

        const categoryName = categoryNames[categoryId] || categoryId;
        return `${categoryName}: ${value}`;
      })
      .join(", ");

    // 이전 영화 목록을 프롬프트에 포함
    const previousMoviesText =
      previousMovieTitles.length > 0
        ? `이전에 추천받은 영화: ${previousMovieTitles.join(", ")}.\n`
        : "";

    return `${previousMoviesText}현재 날씨 정보: 온도 ${temp}, 습도 ${humidity}, 체감온도 ${feelsLike}
사용자 선호 정보: ${userPreferences}

위 정보를 바탕으로 최적의 영화 10개를 추천.
- 날씨와 사용자의 모든 선호 정보를 종합적으로 고려.
- 해리포터 시리즈와 같이 영화 시리즈라고 추천하지말고 딱 하나의 영화만 추천.
- 이전에 추천받은 영화와 중복되지 않도록 다른 영화를 추천.
- 추천 이유나 기타 부연설명은 넣지말고 다음과 같은 형태로만 응답.
- 영화 제목은 기본은 한글, 괄호로 영어 제목으로 ex) 슈퍼맨(Superman) 이런식으로 추천.

[영화제목1, 영화제목2, 영화제목3, 영화제목4, 영화제목5, 영화제목6, 영화제목7, 영화제목8, 영화제목9, 영화제목10]`;
  }

  /**
   * AI 응답에서 영화 제목을 추출합니다
   * @param aiResponse AI 응답 텍스트
   * @returns 추출된 영화 제목 배열
   */
  private extractMovieTitles(aiResponse: string): string[] {
    // 1단계: [영화제목1, 영화제목2, ...] 형태의 패턴 찾기
    const arrayPattern = /\[([^\]]+)\]/g;
    const matches = aiResponse.match(arrayPattern);

    if (matches && matches.length > 0) {
      // 첫 번째 배열 패턴에서 제목들 추출
      const titleString = matches[0].replace(/[\[\]]/g, "");
      const movieTitles = titleString
        .split(",")
        .map((title) => title.trim())
        .filter((title) => title.length > 0);

      return this.cleanMovieTitles(movieTitles);
    }

    // 2단계: 백업 방법 - 숫자로 시작하는 목록 찾기
    const listPattern = /\d+\.\s*([^\n]+)/g;
    const listMatches = Array.from(aiResponse.matchAll(listPattern));

    if (listMatches.length > 0) {
      const movieTitles = listMatches
        .slice(0, 10) // 최대 10개
        .map((match) => match[1].trim())
        .filter((title) => title.length > 0);

      return this.cleanMovieTitles(movieTitles);
    }

    return [];
  }

  /**
   * 영화 제목을 정리합니다 (한글(영어) 형태 지원)
   * @param movieTitles 원본 영화 제목 배열
   * @returns 정리된 영화 제목 배열
   */
  private cleanMovieTitles(movieTitles: string[]): string[] {
    const cleanedTitles = movieTitles
      .map((title) => {
        // 앞뒤 공백 제거
        let cleaned = title.trim();

        // 따옴표 제거
        cleaned = cleaned.replace(/^["']|["']$/g, "");

        // 연도 정보만 제거 (영어 제목은 보존)
        // 예: "영화제목 (2023)" → "영화제목", "한글제목(English Title)" → "한글제목(English Title)"
        cleaned = cleaned.replace(/\s*\(\d{4}\)\s*$/g, "");

        // 한글(영어) 형태 검증 및 정리
        const koreanEnglishPattern = /^(.+?)\s*\(([^)]+)\)\s*$/;
        const match = cleaned.match(koreanEnglishPattern);

        if (match) {
          const koreanTitle = match[1].trim();
          const englishTitle = match[2].trim();

          // 영어 제목이 숫자만 있는 경우 (연도)는 제거
          if (/^\d{4}$/.test(englishTitle)) {
            cleaned = koreanTitle;
          } else {
            cleaned = `${koreanTitle}(${englishTitle})`;
          }
        }

        // 기타 불필요한 특수문자 제거 (괄호와 영어는 보존)
        cleaned = cleaned.replace(/[^\w\s가-힣ㄱ-ㅎㅏ-ㅣ\-:()]/g, "");

        const result = cleaned.trim();

        return result;
      })
      .filter((title) => title.length > 0) // 빈 문자열 제거
      .slice(0, 10); // 최대 10개

    return cleanedTitles;
  }

  /**
   * 영화 제목에서 한글 제목과 영어 제목을 분리합니다
   * @param movieTitle 전체 영화 제목 (예: "아바타(Avatar)")
   * @returns 분리된 제목 객체
   */
  private parseMovieTitle(movieTitle: string): {
    korean: string;
    english: string | null;
  } {
    const koreanEnglishPattern = /^(.+?)\s*\(([^)]+)\)\s*$/;
    const match = movieTitle.match(koreanEnglishPattern);

    if (match) {
      const korean = match[1].trim();
      const english = match[2].trim();

      // 영어 제목이 숫자만 있는 경우 (연도)는 null 처리
      if (/^\d{4}$/.test(english)) {
        return { korean, english: null };
      }

      return { korean, english };
    }

    // 괄호가 없는 경우 한글 제목만 있는 것으로 간주
    return { korean: movieTitle, english: null };
  }
}
