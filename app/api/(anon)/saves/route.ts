import { NextRequest, NextResponse } from "next/server";
import { SaveMovieUseCase } from "@/backend/application/saves/usecases/SaveMovieUseCase";
import { SavedMovieRepositoryImpl } from "@/backend/infrastructure/saves/SavedMovieRepositoryImpl";
import { verifyAccessToken } from "@/backend/common/auth/jwt";
import { SaveMovieRequestDto } from "@/backend/application/saves/dtos/SaveMovieDto";

// Repository와 UseCase 인스턴스 생성
const savedMovieRepository = new SavedMovieRepositoryImpl();
const saveMovieUseCase = new SaveMovieUseCase(savedMovieRepository);

/**
 * 영화 저장 API
 * POST /api/saves
 */
export async function POST(request: NextRequest) {
  try {
    // 1. 쿠키에서 JWT 토큰 추출
    const accessToken = request.cookies.get("access_token")?.value;
    if (!accessToken) {
      return NextResponse.json(
        { success: false, message: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    // 2. JWT 토큰 검증 및 사용자 ID 추출
    let userId: string;
    try {
      const payload = verifyAccessToken(accessToken) as { userId: string };
      userId = payload.userId;
      console.log("🔑 JWT에서 추출된 사용자 ID:", userId);
    } catch (error) {
      console.error("JWT 토큰 검증 오류:", error);
      return NextResponse.json(
        { success: false, message: "유효하지 않은 토큰입니다." },
        { status: 401 }
      );
    }

    // 3. 요청 본문에서 영화 ID와 선택된 날짜 추출
    const body: SaveMovieRequestDto = await request.json();
    const { movieId, selectedDate } = body;

    console.log("📅 받은 데이터:", {
      userId,
      movieId,
      selectedDate,
    });

    // 4. UseCase 실행
    const result = await saveMovieUseCase.execute(userId, {
      movieId,
      selectedDate,
    });

    // 5. 결과 반환
    if (result.success) {
      return NextResponse.json(result, { status: 201 });
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error("영화 저장 API 오류:", error);
    return NextResponse.json(
      {
        success: false,
        message: "서버 내부 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}

/**
 * 저장된 영화 목록 조회 API
 * GET /api/saves
 */
export async function GET(request: NextRequest) {
  try {
    // 1. 쿠키에서 JWT 토큰 추출
    const accessToken = request.cookies.get("access_token")?.value;
    if (!accessToken) {
      return NextResponse.json(
        { success: false, message: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    // 2. JWT 토큰 검증 및 사용자 ID 추출
    let userId: string;
    try {
      const payload = verifyAccessToken(accessToken) as { userId: string };
      userId = payload.userId;
    } catch (error) {
      console.error("JWT 토큰 검증 오류:", error);
      return NextResponse.json(
        { success: false, message: "유효하지 않은 토큰입니다." },
        { status: 401 }
      );
    }

    // 3. 사용자의 저장된 영화 목록 조회
    const savedMovies = await savedMovieRepository.findByUserId(userId);

    return NextResponse.json({
      success: true,
      message: "저장된 영화 목록을 성공적으로 조회했습니다.",
      savedMovies,
    });
  } catch (error) {
    console.error("저장된 영화 목록 조회 API 오류:", error);
    return NextResponse.json(
      {
        success: false,
        message: "서버 내부 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
