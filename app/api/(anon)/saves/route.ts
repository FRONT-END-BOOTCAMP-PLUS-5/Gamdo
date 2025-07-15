import { NextRequest, NextResponse } from "next/server";
import { SaveMovieUseCase } from "@/backend/application/saves/usecases/SaveMovieUseCase";
import { SavedMovieRepositoryImpl } from "@/backend/infrastructure/saves/SavedMovieRepositoryImpl";
import { verifyAccessToken } from "@/backend/common/auth/jwt";
import { SaveMovieRequestDto } from "@/backend/application/saves/dtos/SaveMovieDto";
import { supabase } from "@/utils/supabase/client";

// Repository와 UseCase 인스턴스 생성
const savedMovieRepository = new SavedMovieRepositoryImpl();
const saveMovieUseCase = new SaveMovieUseCase(savedMovieRepository);

/**
 * 영화 저장 API (수파베이스 calendar 테이블)
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
      console.log("토큰 검증 성공, payload:", payload);
      userId = payload.userId;
      console.log("추출된 userId:", userId);

      if (!userId) {
        console.log("❌ userId가 null 또는 undefined입니다!");
        return NextResponse.json(
          { success: false, message: "토큰에 사용자 ID가 없습니다." },
          { status: 401 }
        );
      }
    } catch (error) {
      console.log("토큰 검증 실패:", error);
      return NextResponse.json(
        { success: false, message: "유효하지 않은 토큰입니다." },
        { status: 401 }
      );
    }

    // 3. 사용자 존재 여부 확인 (수파베이스 users 테이블)
    try {
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("user_id")
        .eq("user_id", userId)
        .maybeSingle();

      if (userError) {
        console.log("사용자 조회 중 데이터베이스 오류:", userError);
        return NextResponse.json(
          {
            success: false,
            message: "사용자 정보 확인 중 오류가 발생했습니다.",
          },
          { status: 500 }
        );
      }

      if (!userData) {
        console.log("❌ 사용자 ID가 데이터베이스에 존재하지 않습니다:", userId);
        return NextResponse.json(
          {
            success: false,
            message: "존재하지 않는 사용자입니다. 다시 로그인 해주세요.",
          },
          { status: 401 }
        );
      }

      console.log("✅ 사용자 존재 확인 완료:", userData.user_id);
    } catch (error) {
      console.log("사용자 존재 여부 확인 중 오류:", error);
      return NextResponse.json(
        { success: false, message: "사용자 인증 중 오류가 발생했습니다." },
        { status: 500 }
      );
    }

    // 4. 요청 본문에서 영화 ID와 선택된 날짜 추출
    const body: SaveMovieRequestDto = await request.json();
    const { movieId, selectedDate } = body;

    // 5. UseCase 실행 (수파베이스 calendar 테이블에 저장)
    const result = await saveMovieUseCase.execute(userId, {
      movieId,
      selectedDate,
    });

    // 6. 결과 반환
    if (result.success) {
      return NextResponse.json(result, { status: 201 });
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.log("영화 저장 중 서버 오류:", error);
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
 * 저장된 영화 목록 조회 API (수파베이스 calendar 테이블)
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
    } catch {
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
    console.log("저장된 영화 목록 조회 중 서버 오류:", error);
    return NextResponse.json(
      {
        success: false,
        message: "서버 내부 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
