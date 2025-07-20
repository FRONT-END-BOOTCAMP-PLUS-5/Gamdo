// 배우 출연작 조회 라우트

import { NextRequest, NextResponse } from "next/server";
import { TmdbApi } from "@/utils/tmdb/TmdbApi";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const personId = params.id;

    if (!personId) {
      return NextResponse.json(
        { error: "배우 ID가 필요합니다." },
        { status: 400 }
      );
    }

    const creditsData = await TmdbApi.getPersonCredits(personId);

    return NextResponse.json(creditsData);
  } catch (error: unknown) {
    console.error("배우 출연작 조회 에러:", error);
    const message =
      error instanceof Error
        ? error.message
        : typeof error === "object"
        ? JSON.stringify(error)
        : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
