"use client";

import { useEffect } from "react";
import { useUserStore } from "../stores/userStore";

export default function ClientUserInitializer() {
  const login = useUserStore((state) => state.login);

  useEffect(() => {
    const storage = localStorage.getItem("user-storage");

    if (storage) {
      try {
        const parsed = JSON.parse(storage);
        const user = parsed?.state?.user;

        if (user) {
          login(user);
        }
      } catch (err) {
        console.error("유저 정보 복원 중 오류 발생:", err);
      }
    }
  }, [login]);

  return null;
}
