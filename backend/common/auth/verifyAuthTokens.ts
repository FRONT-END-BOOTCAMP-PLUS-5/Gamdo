import { NextRequest } from "next/server";
import { verifyAccessToken, verifyRefreshToken } from "./jwt";

type TokenStatusResult =
  | { code: "ok"; status: number }
  | { code: "access_expired"; status: number }
  | { code: "refresh_expired"; status: number }
  | { code: "no_token"; status: number }
  | { code: "invalid"; status: number };

export function verifyAuthTokens(req: NextRequest): TokenStatusResult {
  const reqAuthHeader = req.headers.get("authorization");
  const reqAccessToken = reqAuthHeader?.split(" ")[1]; // Bearer <token>
  const reqRefreshToken = req.cookies.get("refresh_token")?.value;

  if (!reqAccessToken) {
    return { code: "no_token", status: 401 };
  }

  try {
    verifyAccessToken(reqAccessToken);
    return { code: "ok", status: 200 };
  } catch {
    if (reqRefreshToken) {
      try {
        verifyRefreshToken(reqRefreshToken);
        return { code: "access_expired", status: 401 };
      } catch {
        return { code: "refresh_expired", status: 401 };
      }
    } else {
      return { code: "invalid", status: 401 };
    }
  }
}
