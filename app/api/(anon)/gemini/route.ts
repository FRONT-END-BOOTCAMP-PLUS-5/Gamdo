import { NextRequest, NextResponse } from "next/server";
import { GeminiService } from "../../../../backend/application/recommender/GetGeminiResponseUseCase";
import { GeminiRepositoryImpl } from "../../../../backend/infrastructure/repositories/recommender/gemini";

// Gemini 응답 요청 인터페이스
interface GeminiRequestBody {
  prompt: string;
  temperature?: number;
  max_tokens?: number;
}

/**
 * Gemini 모델에 프롬프트를 전송하고 응답을 받아옵니다
 * POST /api/gemini
 */
export async function POST(request: NextRequest) {
  try {
    // 요청 본문 파싱
    const body: GeminiRequestBody = await request.json();

    // 입력 검증
    if (!body.prompt || typeof body.prompt !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "프롬프트가 필요합니다.",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // 의존성 주입
    const geminiRepository = new GeminiRepositoryImpl();
    const geminiService = new GeminiService(geminiRepository);

    // Gemini 응답 생성
    const result = await geminiService.generateResponse(
      body.prompt,
      body.temperature,
      body.max_tokens
    );

    // 성공 여부에 따른 응답 상태 코드 설정
    const statusCode = result.success ? 200 : 500;

    return NextResponse.json(result, { status: statusCode });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Gemini 응답 생성 중 서버 오류가 발생했습니다.",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

/**
 * 현재 온도에 대한 간단한 질문을 Gemini에게 전송합니다
 * GET /api/gemini?type=temperature
 */
export async function GET(request: NextRequest) {
  try {
    // 쿼리 파라미터 확인
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    // 의존성 주입
    const geminiRepository = new GeminiRepositoryImpl();
    const geminiService = new GeminiService(geminiRepository);

    let prompt: string;

    // 타입에 따른 프롬프트 생성
    switch (type) {
      case "temperature":
        prompt = geminiService.generateTemperatureQuestion();
        break;
      case "weather":
        prompt = "현재 날씨는 어떤가요? 온도와 날씨 상태를 알려주세요.";
        break;
      default:
        return NextResponse.json(
          {
            success: false,
            error: "올바른 타입을 지정해주세요. (temperature, weather)",
            timestamp: new Date().toISOString(),
          },
          { status: 400 }
        );
    }

    // Gemini 응답 생성
    const result = await geminiService.generateResponse(prompt);

    // 성공 여부에 따른 응답 상태 코드 설정
    const statusCode = result.success ? 200 : 500;

    return NextResponse.json(result, { status: statusCode });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Gemini 응답 생성 중 서버 오류가 발생했습니다.",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
