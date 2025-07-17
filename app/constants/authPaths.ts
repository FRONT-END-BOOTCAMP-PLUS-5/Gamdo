/**
 * 인증이 필요한 주소 목록
 * @AUTH_REQUIRED_API_PATHS  api 요청시 프론트/백에서 모두 사용되기 때문에 한 곳에서 관리함
 * @AUTH_REQUIRED_PAGES_PATHS  프론트에서 상태에 따라 리프레시 토큰 요청, 없으면 로그아웃
 * @AUTH_FORBIDDEN_PAGES_PATHS 로그인페이지, 회원가입페이지
 */

// 인증이 필요한 백엔드 API 경로 (미들웨어, axios 인터셉터에서 사용)
export const AUTH_REQUIRED_API_PATHS = ["/api/review", "/api/user", "/user"];

// 인증이 필요한 프론트 페이지 경로 (pageGuard에서 사용)
export const AUTH_REQUIRED_PAGES_PATHS = ["/mypage"];

// 로그인한 사용자가 접근하면 안 되는 페이지
export const AUTH_FORBIDDEN_PAGES_PATHS = ["/auth/signin", "/auth/signup"];
