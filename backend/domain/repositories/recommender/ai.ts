import { AiRequest, AiResponse } from "../../entities/recommender/ai";

// AI 생성 서비스 리포지토리 인터페이스
export interface AiRepository {
  /**
   * AI 모델에 프롬프트를 전송하고 응답을 받아옵니다
   * @param request AI 생성 요청 파라미터
   * @returns AI 생성 결과
   */
  generateText(request: AiRequest): Promise<AiResponse>;
}
