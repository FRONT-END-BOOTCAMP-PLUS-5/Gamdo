import { NextRequest, NextResponse } from "next/server";
import { SbUserRepository } from "../../../../backend/infrastructure/repositories/SbUserRepository";
import { supabase } from "@/utils/supabase/client";
import { SigninUsecase } from "@/backend/application/signin/usecases/SigninUsecase";
import {
  createAccessToken,
  createRefreshToken,
} from "@/backend/common/auth/jwt";
import { setAuthCookies } from "@/backend/common/auth/cookies";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body) {
      return NextResponse.json(
        { error: "요청 데이터가 없습니다." },
        { status: 400 }
      );
    }
    const userRepository = new SbUserRepository(supabase);
    const signinUseCase = new SigninUsecase(userRepository);

    const result = await signinUseCase.execute(body);

    if (!result.user) {
      return NextResponse.json(
        { error: "로그인에 실패했습니다." },
        { status: 401 }
      );
    }

    // 로그인 성공 시 토큰 생성 및 쿠키 세팅
    const accessToken = createAccessToken({ userId: result.user.userId });
    const refreshToken = createRefreshToken({ userId: result.user.userId });
    // accessToken, refreshToken 쿠키로 세팅
    const response = NextResponse.json({ result }, { status: 200 });
    setAuthCookies(response, accessToken, refreshToken);
    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
