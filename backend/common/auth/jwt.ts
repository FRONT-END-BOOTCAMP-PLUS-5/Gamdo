import jwt, { Secret } from "jsonwebtoken";

const ACCESS_TOKEN_SECRET: Secret = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET: Secret = process.env.REFRESH_TOKEN_SECRET!;

export function createAccessToken(payload: string) {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
}

export function createRefreshToken(payload: string) {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, ACCESS_TOKEN_SECRET);
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, REFRESH_TOKEN_SECRET);
}
