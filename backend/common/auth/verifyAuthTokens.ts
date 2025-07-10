import { NextRequest } from "next/server";
import { verifyAccessToken } from "./jwt";

type TokenStatusResult =
  | { code: "ok"; status: number }
  | { code: "no_token"; status: number }
  | { code: "invalid"; status: number };

export function verifyAuthTokens(req: NextRequest): TokenStatusResult {
  const reqAccessToken = req.cookies.get("access_token")?.value;

  if (!reqAccessToken) {
    return { code: "no_token", status: 401 };
  }

  try {
    verifyAccessToken(reqAccessToken);
    return { code: "ok", status: 200 }; //액세스 토큰 있으면 토큰유효
  } catch {
    return { code: "invalid", status: 401 }; //액세스 토큰 없음
  }
}
