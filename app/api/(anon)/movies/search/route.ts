// 영화 검색 라우트

import { NextRequest, NextResponse } from "next/server";
import { SearchRepositoryImpl } from "@/backend/infrastructure/repositories/movies/SearchRepositoryImpl";
import { SearchMultiUseCase } from "@/backend/application/search/usecases/SearchMultiUseCase";

const searchRepository = new SearchRepositoryImpl();
const searchMultiUseCase = new SearchMultiUseCase(searchRepository);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");
    const page = searchParams.get("page") || "1";

    if (!query) {
      return NextResponse.json(
        { error: "검색어가 필요합니다." },
        { status: 400 }
      );
    }

    const searchResults = await searchMultiUseCase.execute(
      query,
      parseInt(page)
    );

    return NextResponse.json(searchResults);
  } catch (error: unknown) {
    console.error("통합검색 에러:", error);
    const message =
      error instanceof Error
        ? error.message
        : typeof error === "object"
        ? JSON.stringify(error)
        : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
