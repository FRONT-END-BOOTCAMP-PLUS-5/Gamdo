import { AiRepository } from "../../domain/repositories/recommender/ai";
import { AiRequest, AiResponse } from "../../domain/entities/recommender/ai";

// AI 응답 서비스 클래스
export class AiService {
  private aiRepository: AiRepository;

  constructor(aiRepository: AiRepository) {
    this.aiRepository = aiRepository;
  }

  /**
   * AI 모델에 프롬프트를 전송하고 응답을 받아옵니다
   * @param prompt 사용자 프롬프트
   * @param temperature 생성 온도 (0.0 ~ 1.0, 기본값: 0.7)
   * @param max_tokens 최대 토큰 수 (기본값: 1000)
   * @returns AI 생성 결과
   */
  async generateResponse(
    prompt: string,
    temperature: number = 0.7,
    max_tokens: number = 1000
  ): Promise<AiResponse> {
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

      // AI 요청 객체 생성
      const aiRequest: AiRequest = {
        prompt: prompt.trim(),
        temperature,
        max_tokens,
      };

      // 리포지토리를 통해 AI 응답 생성
      const result = await this.aiRepository.generateText(aiRequest);

      return result;
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "AI 응답 생성 중 오류가 발생했습니다.",
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
   * 날씨 정보를 바탕으로 AI에게 질문할 프롬프트를 생성합니다
   * @returns 날씨 기반 프롬프트
   */
  generateWeatherBasedPrompt(): string {
    // 일단 기본 프롬프트 반환 (날씨 정보 연동 전)
    return "현재 날씨는 어떤가요? 온도와 날씨 상태를 알려주세요.";
  }
}
