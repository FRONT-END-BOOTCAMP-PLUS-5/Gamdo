import { UserWithoutSensitive } from "@/backend/application/signin/dtos/SigninDto";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserStore {
  user: UserWithoutSensitive | null;
  isAuthenticated: boolean;
  login: (user: UserWithoutSensitive) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user: UserWithoutSensitive) =>
        set({
          user,
          isAuthenticated: true,
        }),
      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "user-storage",
      skipHydration: true,
    }
  )
);
