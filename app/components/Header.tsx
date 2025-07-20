"use client";

import Image from "next/image";
import Link from "next/link";
import { useUserStore } from "@/app/stores/userStore";
import axios from "@/utils/axios";
import { useRouter, usePathname } from "next/navigation";
import { isAuthRequiredPage } from "@/utils/authUtils";

export default function Header() {
  const { logout, isAuthenticated } = useUserStore();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await axios.post("/auth/logout");
      logout();

      const isAuthRequired = isAuthRequiredPage(pathname);
      // 로그아웃 후 리다이렉트 처리
      if (isAuthRequired) {
        router.push("/");
        return;
      }

      // 퍼블릭 페이지에서 로그아웃 → 현재 페이지 유지
      return;
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  return (
    <header className="sticky top-0 z-10 w-full h-16 bg-gradient-to-b from-black to-[#1D1F28]">
      <div className="h-full flex items-center justify-between px-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Image
              src="/assets/icons/logo.svg"
              alt="로고"
              width={150}
              height={40}
              className="mr-10"
            />
          </Link>
          <nav className="flex-1 flex justify-center gap-8 text-md text-gray-200 font-light">
            <Link
              href="/"
              className={`${
                pathname === "/" ? "font-semibold text-white" : ""
              }`}
            >
              추천
            </Link>
            <Link
              href="/search"
              className={`${
                pathname === "/search" ? "font-semibold text-white" : ""
              }`}
            >
              검색
            </Link>
          </nav>
        </div>
        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <div className="text-white">
              <Link href="/mypage">
                <Image
                  src="/assets/icons/profile.svg"
                  alt="프로필"
                  width={24}
                  height={24}
                />
              </Link>
            </div>
            <div
              className="text-white cursor-pointer whitespace-nowrap"
              onClick={handleLogout}
            >
              로그아웃
            </div>
          </div>
        ) : (
          <div className="text-white cursor-pointer whitespace-nowrap">
            <Link href="/auth/signin">로그인</Link>
          </div>
        )}
      </div>
    </header>
  );
}
