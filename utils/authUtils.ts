import {
  AUTH_FORBIDDEN_PAGES_PATHS,
  AUTH_REQUIRED_PAGES_PATHS,
} from "@/app/constants";

// 인증이 필요한 페이지인지 확인
const isAuthRequiredPage = (pathname: string): boolean => {
  return AUTH_REQUIRED_PAGES_PATHS.some((path) => pathname.startsWith(path));
};

// 로그인, 회원가입 페이지인지 확인
const isAuthForbiddenPage = (pathname: string): boolean => {
  return AUTH_FORBIDDEN_PAGES_PATHS.some((path) => pathname.startsWith(path));
};

const authUtils = {
  isAuthRequiredPage,
  isAuthForbiddenPage,
};

export default authUtils;
export { isAuthRequiredPage, isAuthForbiddenPage };
