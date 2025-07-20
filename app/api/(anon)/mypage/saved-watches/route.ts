import { GetSavedWatchUsecase } from "@/backend/application/saved-watch/usecases/GetSavedWatchUsecase";
import { verifyAuthTokens } from "@/backend/common/auth/verifyAuthTokens";
import { SbSavedWatchRepository } from "@/backend/infrastructure/repositories/SbSavedWatchRepository";
import { supabase } from "@/utils/supabase/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
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

    // maxLength 쿼리 파라미터 파싱
    const { searchParams } = new URL(req.url);
    const maxLengthParam = searchParams.get("maxLength");
    const maxLength = maxLengthParam ? parseInt(maxLengthParam) : 6;

    const savedWatchRepository = new SbSavedWatchRepository(supabase);
    const getSavedWatchUsecase = new GetSavedWatchUsecase(savedWatchRepository);

    const result = await getSavedWatchUsecase.execute(userId, maxLength);
    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 404 });
  }
}
