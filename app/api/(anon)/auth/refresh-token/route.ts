import { NextRequest, NextResponse } from "next/server";
import {
  verifyRefreshToken,
  createAccessToken,
} from "@/backend/common/auth/jwt";
import { UserWithoutSensitive } from "@/backend/application/signin/dtos/SigninDto";

export async function POST(req: NextRequest) {
  const refreshToken = req.cookies.get("refresh_token")?.value;
  if (!refreshToken) {
    return NextResponse.json({ error: "리프레시 토큰 없음" }, { status: 401 });
  }
  try {
    const payload = verifyRefreshToken(refreshToken) as UserWithoutSensitive;
    // 새 액세스 토큰 발급
    const newAccessToken = createAccessToken(payload);
    return NextResponse.json({ accessToken: newAccessToken }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "리프레시 토큰 만료 또는 변조" },
      { status: 401 }
    );
  }
}
