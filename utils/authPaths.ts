/**
 * 인증이 필요한 경로
 * 프론트/백에서 모두 사용되기 때문에 분리해서 관리함
 * 프론트에서 상태에 따라 리프레시 토큰 요청, 없으면 로그아웃
 */

export const AUTH_REQUIRED_PATHS = ["/api/(anon)/review"];
