import { AiRepository } from "../../../domain/repositories/recommender/ai";
import {
  AiRequest,
  AiResponse,
  GeminiApiRequest,
} from "../../../domain/entities/recommender/ai";
import { GeminiApi } from "../../gemini/GeminiApi";

// AI 레포지토리 구현체
export class AiRepositoryImpl implements AiRepository {
  private geminiApi: GeminiApi;

  constructor() {
    this.geminiApi = new GeminiApi();
  }

  /**
   * AI 모델에 프롬프트를 전송하고 응답을 받아옵니다
   * @param request AI 생성 요청 파라미터
   * @returns AI 생성 결과
   */
  async generateText(request: AiRequest): Promise<AiResponse> {
    try {
      // API 설정 확인
      if (!this.geminiApi.isConfigured()) {
        return {
          success: false,
          error: "Gemini API 설정이 올바르지 않습니다.",
          timestamp: new Date().toISOString(),
        };
      }

      // 도메인 요청을 Gemini API 요청으로 변환
      const geminiRequest: GeminiApiRequest = {
        contents: [
          {
            parts: [
              {
                text: request.prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: request.temperature || 0.7,
          maxOutputTokens: request.max_tokens || 4096, // thinking 모드를 고려해서 대폭 증가
        },
      };

      // Gemini API 호출
      const geminiResponse = await this.geminiApi.generateContent(
        geminiRequest
      );

      // 응답 유효성 검사
      if (
        !geminiResponse.candidates ||
        geminiResponse.candidates.length === 0
      ) {
        return {
          success: false,
          error: "AI 모델로부터 응답을 받을 수 없습니다.",
          timestamp: new Date().toISOString(),
        };
      }

      const candidate = geminiResponse.candidates[0];

      // finishReason 확인 - thinking 모드에서 MAX_TOKENS로 잘릴 수 있음
      if (candidate.finishReason === "MAX_TOKENS") {
        return {
          success: false,
          error:
            "AI 응답이 토큰 한계로 인해 잘렸습니다. 더 짧은 프롬프트를 사용해보세요.",
          timestamp: new Date().toISOString(),
        };
      }

      // Gemini 2.5 thinking 모드 대응: parts가 없는 경우 처리
      let generatedText = "";

      if (
        candidate.content &&
        candidate.content.parts &&
        candidate.content.parts.length > 0
      ) {
        // 일반적인 응답 구조
        generatedText = candidate.content.parts[0].text;
      } else if (candidate.text) {
        // 일부 Gemini 버전에서 직접 text 필드 사용
        generatedText = candidate.text;
      } else {
        return {
          success: false,
          error: "AI 모델 응답에서 텍스트를 찾을 수 없습니다.",
          timestamp: new Date().toISOString(),
        };
      }

      // 응답 데이터 추출
      const tokensUsed = geminiResponse.usageMetadata?.totalTokenCount || 0;

      return {
        success: true,
        data: {
          text: generatedText,
          tokens_used: tokensUsed,
          model: "gemini-2.5-flash",
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "AI 생성 중 오류가 발생했습니다.",
        timestamp: new Date().toISOString(),
      };
    }
  }
}
