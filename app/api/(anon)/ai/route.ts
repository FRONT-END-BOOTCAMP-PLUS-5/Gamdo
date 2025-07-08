import { NextRequest, NextResponse } from "next/server";
import { AiService } from "../../../../backend/application/recommender/GetAiResponseUseCase";
import { AiRepositoryImpl } from "../../../../backend/infrastructure/repositories/recommender/ai";

// AI 응답 요청 인터페이스
interface AiRequestBody {
  prompt: string;
  temperature?: number;
  max_tokens?: number;
}

/**
 * AI 모델에 프롬프트를 전송하고 응답을 받아옵니다
 * POST /api/ai
 */
export async function POST(request: NextRequest) {
  try {
    console.log("🔍 AI API 요청 시작");

    // 요청 본문 파싱
    const body: AiRequestBody = await request.json();
    console.log("📝 요청 프롬프트 길이:", body.prompt?.length || 0);

    // 입력 검증
    if (!body.prompt || typeof body.prompt !== "string") {
      console.log("❌ 프롬프트 검증 실패");
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
    console.log("🔧 의존성 주입 중...");
    const aiRepository = new AiRepositoryImpl();
    const aiService = new AiService(aiRepository);

    // AI 응답 생성
    console.log("🤖 AI 응답 생성 시작...");
    const result = await aiService.generateResponse(
      body.prompt,
      body.temperature,
      body.max_tokens
    );

    console.log("✅ AI 응답 완료:", result.success ? "성공" : "실패");
    if (!result.success) {
      console.log("❌ 오류 내용:", result.error);
    }

    // 성공 여부에 따른 응답 상태 코드 설정
    const statusCode = result.success ? 200 : 500;

    return NextResponse.json(result, { status: statusCode });
  } catch (error) {
    console.error("AI API 오류:", error);

    return NextResponse.json(
      {
        success: false,
        error: "AI 응답 생성 중 서버 오류가 발생했습니다.",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

/**
 * 현재 온도에 대한 간단한 질문을 AI에게 전송합니다
 * GET /api/ai?type=temperature
 */
export async function GET(request: NextRequest) {
  try {
    // 쿼리 파라미터 확인
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    // 의존성 주입
    const aiRepository = new AiRepositoryImpl();
    const aiService = new AiService(aiRepository);

    let prompt: string;

    // 타입에 따른 프롬프트 생성
    switch (type) {
      case "temperature":
        prompt = aiService.generateTemperatureQuestion();
        break;
      case "weather":
        prompt = aiService.generateWeatherBasedPrompt();
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

    // AI 응답 생성
    const result = await aiService.generateResponse(prompt);

    // 성공 여부에 따른 응답 상태 코드 설정
    const statusCode = result.success ? 200 : 500;

    return NextResponse.json(result, { status: statusCode });
  } catch (error) {
    console.error("AI API 오류:", error);

    return NextResponse.json(
      {
        success: false,
        error: "AI 응답 생성 중 서버 오류가 발생했습니다.",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
