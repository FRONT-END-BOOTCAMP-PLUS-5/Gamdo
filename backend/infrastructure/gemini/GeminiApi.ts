import {
  GeminiApiRequest,
  GeminiApiResponse,
} from "../../domain/entities/recommender/ai";

// Gemini API 클라이언트 클래스
export class GeminiApi {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    // 환경변수에서 API 키와 베이스 URL 가져오기
    this.apiKey = process.env.GEMINI_API_KEY || "";
    this.baseUrl =
      process.env.GEMINI_BASE_URL ||
      "https://generativelanguage.googleapis.com/v1beta";

    // 필수 환경변수 체크
    if (!this.apiKey) {
      throw new Error("GEMINI_API_KEY 환경변수가 설정되지 않았습니다.");
    }

    if (!this.baseUrl) {
      throw new Error("GEMINI_BASE_URL 환경변수가 설정되지 않았습니다.");
    }
  }

  /**
   * Gemini API에 텍스트 생성 요청을 보냅니다
   * @param request Gemini API 요청 객체
   * @returns Gemini API 응답
   */
  async generateContent(request: GeminiApiRequest): Promise<GeminiApiResponse> {
    try {
      // API 엔드포인트 URL 생성
      const url = `${this.baseUrl}/models/gemini-2.5-flash:generateContent?key=${this.apiKey}`;
      console.log("🌐 Gemini API 호출 시작");
      console.log("📡 호출 URL (key 마스킹):", url.replace(this.apiKey, "***"));

      // HTTP 요청 옵션 설정
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      };

      console.log("📤 요청 데이터:", JSON.stringify(request, null, 2));

      // API 호출
      console.log("⏳ fetch 시작...");
      const response = await fetch(url, options);
      console.log("📊 응답 상태:", response.status, response.statusText);

      // 응답 상태 체크
      if (!response.ok) {
        const errorText = await response.text();
        console.log("❌ API 호출 실패");
        console.log("📄 에러 응답:", errorText);
        throw new Error(
          `Gemini API 호출 실패 (${response.status}): ${errorText}`
        );
      }

      // 응답 데이터 파싱
      console.log("📥 응답 파싱 중...");
      const responseData: GeminiApiResponse = await response.json();
      console.log(
        "✅ 응답 성공, candidates 수:",
        responseData.candidates?.length || 0
      );

      // 디버깅: 실제 응답 구조 확인
      console.log("🔍 실제 응답 구조:", JSON.stringify(responseData, null, 2));

      return responseData;
    } catch (error) {
      throw new Error(
        `Gemini API 호출 중 오류가 발생했습니다: ${
          error instanceof Error ? error.message : "알 수 없는 오류"
        }`
      );
    }
  }

  /**
   * API 키가 설정되어 있는지 확인합니다
   * @returns API 키 설정 여부
   */
  isConfigured(): boolean {
    return !!this.apiKey && !!this.baseUrl;
  }
}
