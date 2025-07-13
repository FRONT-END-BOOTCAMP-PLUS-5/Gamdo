import { NextResponse } from "next/server";
import { GetMovieWeatherUseCase } from "../../../../backend/application/recommenders/usecases/GetMovieWeatherUseCase";
import { WeatherRepositoryImpl } from "../../../../backend/infrastructure/repositories/recommenders/weather";

// 의존성 주입을 위한 인스턴스 생성
const weather_repository = new WeatherRepositoryImpl();
const weather_usecase = new GetMovieWeatherUseCase(weather_repository);

/**
 * 파싱된 날씨 정보 조회 API 엔드포인트
 * GET /api/weather?nx=60&ny=127
 * @param request 요청 객체 (쿼리 파라미터 포함)
 */
export async function GET(request: Request) {
  try {
    console.log("🌤️ 날씨 API 요청 시작:", {
      url: request.url,
      method: request.method,
      timestamp: new Date().toISOString(),
    });

    // 쿼리 파라미터 추출
    const { searchParams } = new URL(request.url);
    const nxParam = searchParams.get("nx");
    const nyParam = searchParams.get("ny");

    console.log("🌤️ 쿼리 파라미터:", {
      nx: nxParam,
      ny: nyParam,
      searchParams: Object.fromEntries(searchParams.entries()),
    });

    // 기본값 설정 (서울 종로구)
    const nx = nxParam ? parseInt(nxParam, 10) : 60;
    const ny = nyParam ? parseInt(nyParam, 10) : 127;

    console.log("🌤️ 파싱된 좌표:", {
      nx,
      ny,
      nxValid: !isNaN(nx) && nx >= 0,
      nyValid: !isNaN(ny) && ny >= 0,
    });

    // 좌표 유효성 검사
    if (isNaN(nx) || isNaN(ny) || nx < 0 || ny < 0) {
      console.error("❌ 좌표 유효성 검사 실패:", {
        nx,
        ny,
        nxValid: !isNaN(nx) && nx >= 0,
        nyValid: !isNaN(ny) && ny >= 0,
      });
      return NextResponse.json(
        {
          error: "올바르지 않은 좌표입니다. nx, ny는 0 이상의 정수여야 합니다.",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // 파싱된 날씨 정보 조회 (동적 좌표 전달)
    console.log("🌤️ UseCase 호출:", {
      nx,
      ny,
      timestamp: new Date().toISOString(),
    });

    const result = await weather_usecase.getWeatherApiResponse({ nx, ny });

    console.log("🌤️ UseCase 응답:", {
      success: result.success,
      hasWeatherInfo: !!result.weatherInfo,
      error: result.error,
      timestamp: result.timestamp,
    });

    if (!result.success) {
      console.error("❌ UseCase 실행 실패:", {
        error: result.error,
        timestamp: result.timestamp,
      });
      return NextResponse.json(
        {
          error: result.error,
          timestamp: result.timestamp,
        },
        { status: 500 }
      );
    }

    // 성공 응답
    const successResponse = {
      success: true,
      weatherInfo: result.weatherInfo,
      timestamp: result.timestamp,
      message: result.message,
    };

    console.log("✅ 날씨 API 성공 응답:", {
      hasWeatherInfo: !!successResponse.weatherInfo,
      timestamp: successResponse.timestamp,
      message: successResponse.message,
    });

    return NextResponse.json(successResponse);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "서버 내부 오류가 발생했습니다";

    console.error("❌ 날씨 API 전역 오류:", {
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        error: errorMessage,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
