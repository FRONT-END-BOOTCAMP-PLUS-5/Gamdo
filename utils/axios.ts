import axios from "axios";
import { AUTH_REQUIRED_API_PATHS } from "@/app/constants";

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
  return AUTH_REQUIRED_API_PATHS.some((path) => url.startsWith(path));
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

    window.location.href = "/auth/signin";
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
        console.log("리프레시 토큰 만료 - 완전한 로그아웃 처리");
        await handleAuthFailure();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
