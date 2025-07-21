import { NextRequest, NextResponse } from "next/server";
import { GetSavedMovieUseCase } from "@/backend/application/saves/usecases/GetSavedMovieUseCase";
import { SavedMovieRepositoryImpl } from "@/backend/infrastructure/saves/SavedMovieRepositoryImpl";
import { verifyAuthTokens } from "@/backend/common/auth/verifyAuthTokens";

export async function GET(request: NextRequest) {
  try {
    // 인증 확인
    const authResult = verifyAuthTokens(request);
    if (authResult.code !== "ok") {
      return NextResponse.json(
        { error: authResult.code },
        { status: authResult.status }
      );
    }

    const { searchParams } = new URL(request.url);
    const movieId = searchParams.get("movieId");

    if (!movieId) {
      return NextResponse.json(
        { error: "Movie ID is required" },
        { status: 400 }
      );
    }

    const savedMovieRepository = new SavedMovieRepositoryImpl();
    const getSavesListUseCase = new GetSavedMovieUseCase(savedMovieRepository);

    // 현재 유저와 영화 ID로 저장된 날짜들 가져오기
    const result = await getSavesListUseCase.execute({
      userId: authResult.userId,
      movieId: movieId,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching saves list:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
