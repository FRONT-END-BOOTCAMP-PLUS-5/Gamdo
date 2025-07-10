import { GeminiRepository } from "../../../domain/repositories/recommender/gemini";
import {
  GeminiRequest,
  GeminiResponse,
  GeminiApiResponse,
} from "../../../domain/entities/recommender/gemini";
import { GeminiApi } from "../../gemini/GeminiApi";

// Gemini 레포지토리 구현체
export class GeminiRepositoryImpl implements GeminiRepository {
  private geminiApi: GeminiApi;

  constructor() {
    this.geminiApi = new GeminiApi();
  }

  /**
   * Gemini 모델에 프롬프트를 전송하고 응답을 받아옵니다
   * @param request Gemini 생성 요청 파라미터
   * @returns Gemini 생성 결과
   */
  async generateText(request: GeminiRequest): Promise<GeminiResponse> {
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
      const geminiRequest = {
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
          maxOutputTokens: request.max_tokens || 1000,
        },
      };

      // Gemini API 호출
      const geminiResponse: GeminiApiResponse =
        await this.geminiApi.generateContent(geminiRequest);

      // 응답 유효성 검사
      if (
        !geminiResponse.candidates ||
        geminiResponse.candidates.length === 0
      ) {
        return {
          success: false,
          error: "Gemini 모델로부터 응답을 받을 수 없습니다.",
          timestamp: new Date().toISOString(),
        };
      }

      const candidate = geminiResponse.candidates[0];

      // 응답 텍스트 추출
      let generatedText = "";

      if (candidate.content?.parts && candidate.content.parts.length > 0) {
        generatedText = candidate.content.parts[0].text;
      } else if (candidate.text) {
        generatedText = candidate.text;
      } else {
        return {
          success: false,
          error: "Gemini 모델 응답에서 텍스트를 찾을 수 없습니다.",
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
            : "Gemini 생성 중 오류가 발생했습니다.",
        timestamp: new Date().toISOString(),
      };
    }
  }
}
