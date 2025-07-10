// Gemini 생성 요청 DTO
export interface GeminiRequest {
  prompt: string;
  temperature?: number;
  max_tokens?: number;
}

// Gemini 응답 DTO
export interface GeminiResponse {
  success: boolean;
  data?: {
    text: string;
    tokens_used?: number;
    model?: string;
  };
  error?: string;
  timestamp: string;
}

// Gemini API 원시 응답 구조 (인프라 계층에서 사용)
export interface GeminiApiResponse {
  candidates: {
    content?: {
      parts?: {
        text: string;
      }[];
    };
    finishReason?: string;
    index?: number;
    text?: string;
  }[];
  usageMetadata?: {
    promptTokenCount: number;
    candidatesTokenCount?: number;
    totalTokenCount: number;
  };
  modelVersion?: string;
}
