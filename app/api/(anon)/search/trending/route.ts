// 트렌딩 영화 조회 라우트

import { NextRequest, NextResponse } from "next/server";
import { TmdbApi } from "@/utils/tmdb/TmdbApi";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";

    const trendingData = await TmdbApi.getTrendingMovies(parseInt(page));

    return NextResponse.json(trendingData);
  } catch (error: unknown) {
    console.error("트렌딩 영화 조회 에러:", error);
    const message =
      error instanceof Error
        ? error.message
        : typeof error === "object"
        ? JSON.stringify(error)
        : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
