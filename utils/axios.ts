import axios from "axios";
import { AUTH_REQUIRED_PATHS } from "@/utils/authPaths";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

function isAuthRequired(url: string) {
  // url이 AUTH_REQUIRED_PATHS 중 하나로 시작하면 인증 필요
  return AUTH_REQUIRED_PATHS.some((path) => url.startsWith(path));
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
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
