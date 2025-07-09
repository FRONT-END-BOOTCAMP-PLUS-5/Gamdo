import { NextRequest } from "next/server";
import { verifyAccessToken } from "./jwt";

export function getUserFromRequest(req: NextRequest) {
  const accessToken = req.cookies.get("access_token")?.value;
  if (!accessToken) throw new Error("토큰 없음");
  return verifyAccessToken(accessToken);
}
