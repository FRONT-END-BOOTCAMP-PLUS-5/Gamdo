import { NextRequest, NextResponse } from "next/server";
import { verifyAuthTokens } from "@/backend/common/auth/verifyAuthTokens";
import { AUTH_REQUIRED_API_PATHS } from "./constants";

export function middleware(req: NextRequest) {
  const authResult = verifyAuthTokens(req);

  if (authResult.code === "ok") {
    // 액세스 토큰이 유효하면 계속 진행
    return NextResponse.next();
  }

  // 그 외의 경우에는 에러 코드와 상태를 프론트로 반환
  return NextResponse.json(
    { error: authResult.code },
    { status: authResult.status }
  );
}

export const config = {
  matcher: AUTH_REQUIRED_API_PATHS, // 인증이 필요한 경로만 적용
};
