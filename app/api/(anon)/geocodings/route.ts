import { NextRequest, NextResponse } from "next/server";
import { GetAddressFromCoordinatesUseCase } from "../../../../backend/application/recommenders/usecases/GetAddressFromCoordinatesUseCase";
import { GeocodeRepositoryImpl } from "../../../../backend/infrastructure/repositories/recommenders/geocode";

// 의존성 주입을 위한 인스턴스 생성
const geocodeRepository = new GeocodeRepositoryImpl();
const geocodeUseCase = new GetAddressFromCoordinatesUseCase(geocodeRepository);

/**
 * 역지오코딩 API 엔드포인트
 * GET /api/geocodings?latitude=37.5665&longitude=126.9780
 * @param request 요청 객체 (쿼리 파라미터 포함)
 */
export async function GET(request: NextRequest) {
  try {
    // 쿼리 파라미터 추출
    const { searchParams } = new URL(request.url);
    const latitudeParam = searchParams.get("latitude");
    const longitudeParam = searchParams.get("longitude");

    // 필수 파라미터 검증
    if (!latitudeParam || !longitudeParam) {
      return NextResponse.json(
        {
          success: false,
          error: "latitude와 longitude 파라미터가 필요합니다.",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // 숫자 변환 및 유효성 검사
    const latitude = parseFloat(latitudeParam);
    const longitude = parseFloat(longitudeParam);

    if (isNaN(latitude) || isNaN(longitude)) {
      return NextResponse.json(
        {
          success: false,
          error: "latitude와 longitude는 유효한 숫자여야 합니다.",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // 🏗️ UseCase 호출 (클린 아키텍처)
    const result = await geocodeUseCase.execute({
      latitude,
      longitude,
    });

    // 성공 응답
    if (result.success) {
      return NextResponse.json(result);
    }

    // 실패 응답
    return NextResponse.json(result, { status: 500 });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "서버 내부 오류가 발생했습니다";

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
