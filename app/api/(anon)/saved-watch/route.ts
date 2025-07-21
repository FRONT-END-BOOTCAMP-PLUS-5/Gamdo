import { CreateSavedWatchDto } from "@/backend/application/saved-watch/dtos/CreateSavedWatchDto";
import { CreateSavedWatchUsecase } from "@/backend/application/saved-watch/usecases/CreateSavedWatchUsecase";
import { DeleteSavedWatchUsecase } from "@/backend/application/saved-watch/usecases/DeleteSavedWatchUsecase";
import { GetSavedWatchMovieDetailUsecase } from "@/backend/application/saved-watch/usecases/GetSavedWatchMovieDetailUsecase";
import { verifyAuthTokens } from "@/backend/common/auth/verifyAuthTokens";
import { SbSavedWatchRepository } from "@/backend/infrastructure/repositories/SbSavedWatchRepository";
import { supabase } from "@/utils/supabase/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // 1. 토큰 인증 및 사용자 ID 추출 (인증 실패해도 계속 진행)
    const authResult = verifyAuthTokens(req);
    let userId: string | null = null;

    if (authResult.code === "ok") {
      userId = authResult.userId;
    }

    // 2. 쿼리 파라미터에서 영화 ID 추출
    const { searchParams } = new URL(req.url);
    const movieId = searchParams.get("movieId");

    // 3. 영화 ID가 없으면 에러 반환
    if (!movieId) {
      return NextResponse.json(
        {
          success: false,
          message: "영화 ID가 필요합니다. (movieId 파라미터를 추가해주세요)",
        },
        { status: 400 }
      );
    }

    // 4. 인증되지 않은 사용자인 경우 기본 응답 반환
    if (!userId) {
      return NextResponse.json({
        success: true,
        isSaved: false,
        savedWatch: null,
        message: "로그인이 필요합니다.",
      });
    }

    // 5. UseCase 실행
    const savedWatchRepository = new SbSavedWatchRepository(supabase);
    const getSavedWatchMovieDetailUsecase = new GetSavedWatchMovieDetailUsecase(
      savedWatchRepository
    );

    const result = await getSavedWatchMovieDetailUsecase.execute(
      userId,
      movieId
    );

    // 6. 결과 반환
    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error("찜하기 상태 조회 중 서버 오류:", error);
    return NextResponse.json(
      {
        success: false,
        message: "서버 내부 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const authResult = verifyAuthTokens(req);
    if (authResult.code !== "ok") {
      return NextResponse.json(
        { error: authResult.code },
        { status: authResult.status }
      );
    }
    const userId = authResult.userId;
    if (!userId) {
      return NextResponse.json(
        { error: "Invalid token payload: userId missing" },
        { status: 400 }
      );
    }

    const { movieId, isRecommended } = await req.json();
    if (!movieId || !isRecommended) {
      return NextResponse.json(
        { error: "movieId, isRecommended are required" },
        { status: 400 }
      );
    }

    const savedWatchRepository = new SbSavedWatchRepository(supabase);
    const createSavedWatchUsecase = new CreateSavedWatchUsecase(
      savedWatchRepository
    );

    const createSavedWatchDto: CreateSavedWatchDto = {
      userId,
      movieId,
      isRecommended,
    };

    const savedWatch = await createSavedWatchUsecase.execute(
      createSavedWatchDto
    );
    return NextResponse.json({ savedWatch }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 404 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const authResult = verifyAuthTokens(req);
    if (authResult.code !== "ok") {
      return NextResponse.json(
        { error: authResult.code },
        { status: authResult.status }
      );
    }
    const userId = authResult.userId;
    if (!userId) {
      return NextResponse.json(
        { error: "Invalid token payload: userId missing" },
        { status: 400 }
      );
    }

    const { movieId } = await req.json();
    if (!movieId) {
      return NextResponse.json(
        { error: "movieId is required" },
        { status: 400 }
      );
    }

    const savedWatchRepository = new SbSavedWatchRepository(supabase);
    const deleteSavedWatchUsecase = new DeleteSavedWatchUsecase(
      savedWatchRepository
    );

    await deleteSavedWatchUsecase.execute(userId, movieId);
    return NextResponse.json(
      { message: "Saved watch deleted" },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 404 });
  }
}
