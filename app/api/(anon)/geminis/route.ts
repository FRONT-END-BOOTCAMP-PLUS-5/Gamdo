import { NextRequest, NextResponse } from "next/server";
import { GetGeminiMovieRecommendationUseCase } from "../../../../backend/application/recommenders/usecases/GetGeminiMovieRecommendationUseCase";
import { GeminiRepositoryImpl } from "../../../../backend/infrastructure/repositories/recommenders/gemini";
import { WeatherInfo } from "../../../../backend/domain/entities/recommenders/weather";

// Gemini 응답 요청 인터페이스 (클린 아키텍처 준수)
interface GeminiRequestBody {
  // 🔹 기존 방식: 직접 프롬프트 전달
  prompt?: string;
  temperature?: number;
  max_tokens?: number;

  // 🔹 새로운 방식: 영화 추천 (백엔드 UseCase 활용)
  type?: "movie-recommendation";
  weather?: WeatherInfo;
  userSelection?: { [key: string]: string };
}

/**
 * Gemini 모델에 요청을 전송하고 응답을 받아옵니다
 * POST /api/geminis
 *
 * 🏗️ 클린 아키텍처 준수:
 * - 라우터: 요청 분기 및 백엔드 UseCase 호출
 * - UseCase: 모든 비즈니스 로직 처리
 */
export async function POST(request: NextRequest) {
  try {
    // 요청 본문 파싱
    const body: GeminiRequestBody = await request.json();

    // 의존성 주입 (공통)
    const geminiRepository = new GeminiRepositoryImpl();
    const geminiUseCase = new GetGeminiMovieRecommendationUseCase(
      geminiRepository
    );

    // 🎬 영화 추천 요청 처리 (클린 아키텍처)
    if (body.type === "movie-recommendation") {
      // 입력 검증
      if (!body.weather) {
        return NextResponse.json(
          {
            success: false,
            error: "날씨 정보가 필요합니다.",
            timestamp: new Date().toISOString(),
          },
          { status: 400 }
        );
      }

      if (!body.userSelection || Object.keys(body.userSelection).length === 0) {
        return NextResponse.json(
          {
            success: false,
            error: "사용자 선택 정보가 필요합니다.",
            timestamp: new Date().toISOString(),
          },
          { status: 400 }
        );
      }

      // 🏗️ 백엔드 UseCase 호출 (모든 비즈니스 로직은 UseCase에서 처리)
      const result = await geminiUseCase.execute({
        weather: body.weather,
        userSelection: body.userSelection,
        temperature: body.temperature || 0.7,
        max_tokens: body.max_tokens || 4096,
      });

      const statusCode = result.success ? 200 : 500;
      return NextResponse.json(result, { status: statusCode });
    }

    // 📝 기존 직접 프롬프트 방식 (하위 호환성 유지)
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

    // Gemini 응답 생성 (기존 방식)
    const result = await geminiUseCase.generateResponse({
      prompt: body.prompt,
      temperature: body.temperature,
      max_tokens: body.max_tokens,
    });

    const statusCode = result.success ? 200 : 500;
    return NextResponse.json(result, { status: statusCode });
  } catch (error) {
    console.error("Gemini API 오류:", error);
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
 * GET /api/geminis?type=temperature
 */
export async function GET(request: NextRequest) {
  try {
    // 쿼리 파라미터 확인
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    // 의존성 주입
    const geminiRepository = new GeminiRepositoryImpl();
    const geminiUseCase = new GetGeminiMovieRecommendationUseCase(
      geminiRepository
    );

    let prompt: string;

    // 타입에 따른 프롬프트 생성
    switch (type) {
      case "temperature":
        prompt = "현재 온도에 대해 간단히 설명해주세요.";
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
    const result = await geminiUseCase.generateResponse({
      prompt,
      temperature: 0.7,
      max_tokens: 1000,
    });

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
