import { NextResponse } from "next/server";
import { WeatherService } from "../../../backend/application/weather";
import { WeatherRepositoryImpl } from "../../../backend/infrastructure/repositories/weather";

// 의존성 주입을 위한 인스턴스 생성
const weather_repository = new WeatherRepositoryImpl();
const weather_service = new WeatherService(weather_repository);

/**
 * 파싱된 날씨 정보 조회 API 엔드포인트
 * GET /api/weather?nx=60&ny=127
 * @param request 요청 객체 (쿼리 파라미터 포함)
 */
export async function GET(request: Request) {
  try {
    // 쿼리 파라미터 추출
    const { searchParams } = new URL(request.url);
    const nxParam = searchParams.get("nx");
    const nyParam = searchParams.get("ny");

    // 기본값 설정 (서울 종로구)
    const nx = nxParam ? parseInt(nxParam, 10) : 60;
    const ny = nyParam ? parseInt(nyParam, 10) : 127;

    // 좌표 유효성 검사
    if (isNaN(nx) || isNaN(ny) || nx < 0 || ny < 0) {
      return NextResponse.json(
        {
          error: "올바르지 않은 좌표입니다. nx, ny는 0 이상의 정수여야 합니다.",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    console.log(`🌤️ 파싱된 날씨 정보 조회 시작 (nx: ${nx}, ny: ${ny})`);

    // 파싱된 날씨 정보 조회 (동적 좌표 전달)
    const result = await weather_service.getCurrentWeatherParsed(nx, ny);

    if (!result.success) {
      return NextResponse.json(
        {
          error: result.error,
          timestamp: result.timestamp,
        },
        { status: 500 }
      );
    }

    console.log("✅ 파싱된 날씨 정보 조회 성공");

    // 성공 응답
    return NextResponse.json({
      success: true,
      weatherInfo: result.data,
      timestamp: result.timestamp,
      message: "파싱된 날씨 정보입니다",
    });
  } catch (error) {
    console.error("💥 파싱된 날씨 API 호출 중 오류 발생:", error);
    return NextResponse.json(
      {
        error: "서버 내부 오류가 발생했습니다",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
