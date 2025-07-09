import { User } from "../../../domain/entities/User";

export type UserWithoutSensitive = Omit<User, "password" | "created_at">;

export interface SigninRequestDto {
  login_id: string;
  password: string;
}

export interface SigninResponseDto {
  success: boolean;
  message: string;
  user?: UserWithoutSensitive;
}
