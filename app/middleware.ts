import { NextRequest, NextResponse } from "next/server";
import { verifyAuthTokens } from "@/backend/common/auth/verifyAuthTokens";
import { AUTH_REQUIRED_API_PATHS } from "./constants";

export function middleware(req: NextRequest) {
  // CORS preflight 요청 처리
  if (req.method === "OPTIONS") {
    const allowedOrigin =
      process.env.NODE_ENV === "production"
        ? "https://gamdo-five.vercel.app"
        : "*";

    return new NextResponse(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": allowedOrigin,
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers":
          "Content-Type, Authorization, X-Requested-With",
        "Access-Control-Allow-Credentials": "true",
      },
    });
  }

  // CORS 헤더 추가
  const response = NextResponse.next();
  const allowedOrigin =
    process.env.NODE_ENV === "production"
      ? "https://gamdo-five.vercel.app"
      : "*";

  response.headers.set("Access-Control-Allow-Origin", allowedOrigin);
  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  );

  // 인증이 필요한 경로인지 확인
  const isAuthRequired = AUTH_REQUIRED_API_PATHS.some((path) =>
    req.nextUrl.pathname.startsWith(path)
  );

  if (isAuthRequired) {
    const authResult = verifyAuthTokens(req);

    if (authResult.code === "ok") {
      // 액세스 토큰이 유효하면 계속 진행
      return response;
    }

    // 그 외의 경우에는 에러 코드와 상태를 프론트로 반환
    const errorResponse = NextResponse.json(
      { error: authResult.code },
      { status: authResult.status }
    );

    // CORS 헤더 추가
    errorResponse.headers.set("Access-Control-Allow-Origin", allowedOrigin);
    errorResponse.headers.set("Access-Control-Allow-Credentials", "true");
    errorResponse.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    errorResponse.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Requested-With"
    );

    return errorResponse;
  }

  return response;
}

export const config = {
  matcher: [
    // 모든 API 라우트에 CORS 헤더 적용
    "/api/:path*",
    // 인증이 필요한 경로는 추가로 인증 처리
    ...AUTH_REQUIRED_API_PATHS,
  ],
};
