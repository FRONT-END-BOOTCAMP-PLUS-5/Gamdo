"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useUserStore } from "../stores/userStore";
import { isAuthForbiddenPage, isAuthRequiredPage } from "@/utils/authUtils";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthPageGuard({ children }: AuthGuardProps) {
  const { user, login } = useUserStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isInitialized, setIsInitialized] = useState(false);

  //1단계: localStorage에서 사용자 정보 복원
  useEffect(() => {
    const initializeUser = () => {
      if (typeof window !== "undefined") {
        const storage = localStorage.getItem("user-storage");

        if (storage) {
          try {
            const parsed = JSON.parse(storage);
            const storedUser = parsed?.state?.user;

            if (storedUser) {
              console.log("🔄 localStorage에서 사용자 정보 복원:", storedUser);
              login(storedUser);
            }
          } catch (err) {
            console.error("유저 정보 복원 중 오류 발생:", err);
          }
        }

        setIsInitialized(true);
        console.log("✅ 초기화 완료");
      }
    };

    initializeUser();
  }, [login]);

  // 2단계: 초기화 완료 후 인증 체크
  useEffect(() => {
    // 초기화가 완료되지 않았으면 대기
    if (!isInitialized) {
      console.log("⏳ 초기화 대기 중...");
      return;
    }

    const isAuthRequired = isAuthRequiredPage(pathname);
    const isAuthForbidden = isAuthForbiddenPage(pathname);

    console.log("🔍 인증 체크:", {
      user: !!user,
      isAuthRequired,
      isAuthForbidden,
      pathname,
      userDetails: user,
    });

    // 조건별 상세 로그
    if (isAuthRequired && !user) {
      console.log("❌ 인증 필요 페이지 접근 - 로그인 페이지로 리다이렉트");
      router.push("/auth/signin");
    } else if (isAuthForbidden && user) {
      console.log("❌ 로그인 상태에서 로그인 페이지 접근 - 홈으로 리다이렉트");
      router.push("/");
    } else {
      console.log("✅ 인증 체크 통과 - 페이지 렌더링 허용");
    }
  }, [user, pathname, router, isInitialized]);

  // 초기화 중에는 로딩 표시
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-[#1] flex items-center justify-center">
        <div className="text-white">로딩 중...</div>
      </div>
    );
  }

  return <>{children}</>;
}
