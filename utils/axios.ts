import axios from "axios";
import { AUTH_REQUIRED_API_PATHS_FOR_AXIOS } from "@/app/constants";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 인증이 필요한 api 주소인지 확인
function isAuthRequired(url: string) {
  return AUTH_REQUIRED_API_PATHS_FOR_AXIOS.some((path) => url.startsWith(path));
}

// 전역 상태 초기화를 위한 함수 (클라이언트 사이드에서만 실행)
async function handleAuthFailure() {
  if (typeof window !== "undefined") {
    try {
      await instance.post("/auth/logout");
    } catch (error) {
      console.warn("로그아웃 API 호출 실패:", error);
    }

    localStorage.removeItem("user-storage");

    try {
      const { useUserStore } = await import("@/app/stores/userStore");
      useUserStore.getState().logout();
    } catch (error) {
      console.warn("Zustand 상태 초기화 실패:", error);
    }
  }
}

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // 인증이 필요한 경로에만 인터셉터 동작
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      isAuthRequired(originalRequest.url)
    ) {
      originalRequest._retry = true;
      try {
        await instance.post("/auth/refresh-token");

        return instance(originalRequest);
      } catch (refreshError) {
        console.log("❌ 리프레시 토큰 실패:", refreshError);

        await handleAuthFailure();
        return Promise.reject(refreshError);
      }
    }
    //TODO: 401, 403 에러 처리 로직 개선 필요
    // 403 에러 (토큰 갱신 불가능) 또는 기타 인증 관련 에러 처리
    if (
      error.response &&
      error.response.status === 403 &&
      (isAuthRequired(originalRequest.url) ||
        originalRequest.url?.includes("/auth/refresh-token"))
    ) {
      console.log("🚫 토큰 갱신 불가능 - 바로 로그아웃 처리");
      alert("로그인 후 이용해주세요.");
      await handleAuthFailure();
    }

    console.log("⚠️ 인터셉터 조건 불만족 - 에러 그대로 반환");
    return Promise.reject(error);
  }
);

export default instance;
