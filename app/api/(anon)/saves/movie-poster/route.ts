import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

/**
 * 영화 포스터 정보 조회 API
 * GET /api/saves/movie-poster?movieId=123
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

    if (!TMDB_API_KEY) {
      console.error("TMDB_API_KEY가 환경변수에 설정되지 않았습니다.");
      return NextResponse.json(
        {
          success: false,
          error: "TMDB API 키가 설정되지 않았습니다.",
        },
        { status: 500 }
      );
    }

    console.log(`🎬 영화 포스터 정보 요청: movieId=${movieId}`);

    // TMDB API 직접 호출
    const url = `${TMDB_BASE_URL}/movie/${movieId}`;
    const response = await axios.get(url, {
      params: {
        api_key: TMDB_API_KEY,
        language: "ko-KR",
      },
    });

    const { id, title, poster_path, backdrop_path, overview, release_date } =
      response.data;

    // 포스터 URL 생성
    const posterUrl = poster_path
      ? `https://image.tmdb.org/t/p/w500${poster_path}`
      : null;

    const backdropUrl = backdrop_path
      ? `https://image.tmdb.org/t/p/w1280${backdrop_path}`
      : null;

    const result = {
      id,
      title,
      poster_path,
      backdrop_path,
      posterUrl,
      backdropUrl,
      overview,
      release_date,
    };

    console.log(`✅ 영화 포스터 정보 조회 성공:`, {
      movieId,
      title,
      hasPoster: !!poster_path,
      hasBackdrop: !!backdrop_path,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: unknown) {
    console.error("영화 포스터 정보 조회 오류:", error);

    // TMDB API 오류 상세 정보
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as {
        response: { status: number; statusText: string };
      };
      const status = axiosError.response.status;
      const statusText = axiosError.response.statusText;

      if (status === 404) {
        const { searchParams } = new URL(request.url);
        return NextResponse.json(
          {
            success: false,
            error: `영화 ID ${searchParams.get("movieId")}를 찾을 수 없습니다.`,
          },
          { status: 404 }
        );
      }

      if (status === 401) {
        return NextResponse.json(
          {
            success: false,
            error: "TMDB API 키가 유효하지 않습니다.",
          },
          { status: 401 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: `TMDB API 오류: ${status} ${statusText}`,
        },
        { status: status }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "영화 포스터 정보를 가져오는 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
