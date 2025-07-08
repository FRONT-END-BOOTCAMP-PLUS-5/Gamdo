// AI 생성 요청 인터페이스
export interface AiRequest {
  prompt: string; // 사용자 프롬프트
  temperature?: number; // 생성 온도 (0.0 ~ 1.0)
  max_tokens?: number; // 최대 토큰 수
}

// AI 응답 인터페이스
export interface AiResponse {
  success: boolean;
  data?: {
    text: string; // 생성된 텍스트
    tokens_used?: number; // 사용된 토큰 수
    model?: string; // 사용된 모델명
  };
  error?: string;
  timestamp: string;
}

// Gemini API 원시 응답 구조
export interface GeminiApiResponse {
  candidates: {
    content?: {
      parts?: {
        text: string;
      }[];
      role?: string;
    };
    finishReason?: string; // "STOP", "MAX_TOKENS", "SAFETY", etc.
    index?: number;
    text?: string; // 일부 버전에서 직접 text 필드 사용
  }[];
  usageMetadata?: {
    promptTokenCount: number;
    candidatesTokenCount?: number;
    totalTokenCount: number;
    promptTokensDetails?: {
      modality: string;
      tokenCount: number;
    }[];
    thoughtsTokenCount?: number; // Gemini 2.5 thinking 모드
  };
  modelVersion?: string;
  responseId?: string;
}

// Gemini API 요청 구조
export interface GeminiApiRequest {
  contents: {
    parts: {
      text: string;
    }[];
  }[];
  generationConfig?: {
    temperature?: number;
    maxOutputTokens?: number;
  };
}
