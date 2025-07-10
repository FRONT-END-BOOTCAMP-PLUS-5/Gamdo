import { User } from "../../../domain/entities/User";

export type UserWithoutSensitive = Omit<User, "password" | "createdAt">;

export interface SigninRequestDto {
  loginId: string;
  password: string;
}

export interface SigninResponseDto {
  success: boolean;
  message: string;
  user?: UserWithoutSensitive;
}
