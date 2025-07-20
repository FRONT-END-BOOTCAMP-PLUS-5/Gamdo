import {
  GeminiRequest,
  GeminiResponse,
} from "../../entities/recommenders/gemini";

// Gemini 생성 서비스 리포지토리 인터페이스
export interface GeminiRepository {
  /**
   * Gemini 모델에 프롬프트를 전송하고 응답을 받아옵니다
   * @param request Gemini 생성 요청 파라미터
   * @returns Gemini 생성 결과
   */
  generateText(request: GeminiRequest): Promise<GeminiResponse>;
}
