import { NextRequest, NextResponse } from "next/server";
import { GetMovieInfoUseCase } from "../../../../../backend/application/saves/usecases/GetMovieInfoUseCase";
import { MovieInfoRepositoryImpl } from "../../../../../backend/infrastructure/saves/MovieInfoRepositoryImpl";

/**
 * 영화 정보 조회 API
 * GET /api/saves/movie-info?movieId=123
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const movieId = searchParams.get("movieId");

    if (!movieId) {
      return NextResponse.json(
        {
          success: false,
          error: "movieId 파라미터가 필요합니다.",
        },
        { status: 400 }
      );
    }

    // 의존성 주입 및 UseCase 실행
    const movieInfoRepository = new MovieInfoRepositoryImpl();
    const getMovieInfoUseCase = new GetMovieInfoUseCase(movieInfoRepository);

    const result = await getMovieInfoUseCase.execute({ movieId });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "영화 정보를 가져오는 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
