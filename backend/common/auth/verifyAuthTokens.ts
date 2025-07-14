import { NextRequest } from "next/server";
import { verifyAccessToken } from "./jwt";
import jwt from "jsonwebtoken";

type TokenStatusResult =
  | { code: "ok"; status: number; userId: string }
  | { code: "no_token"; status: number }
  | { code: "invalid"; status: number };

export function verifyAuthTokens(req: NextRequest): TokenStatusResult {
  const reqAccessToken = req.cookies.get("access_token")?.value;

  if (!reqAccessToken) {
    return { code: "no_token", status: 401 };
  }

  try {
    const decoded = verifyAccessToken(reqAccessToken) as jwt.JwtPayload;

    const userId = decoded.userId;

    if (!userId) throw new Error("No userId in token");

    return { code: "ok", status: 200, userId };
  } catch {
    return { code: "invalid", status: 401 };
  }
}
