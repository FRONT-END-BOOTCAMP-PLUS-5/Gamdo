"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { useUserStore } from "../stores/userStore";
import { isAuthForbiddenPage, isAuthRequiredPage } from "@/utils/authUtils";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthPageGuard({ children }: AuthGuardProps) {
  const user = useUserStore((state) => state.user);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const isAuthRequired = isAuthRequiredPage(pathname);
    const isAuthForbidden = isAuthForbiddenPage(pathname);

    if (isAuthRequired && !user) {
      router.push("/auth/signin");
    } else if (isAuthForbidden && user) {
      router.push("/");
    }
  }, [user, pathname, router]);

  return <>{children}</>;
}
