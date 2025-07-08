import { User } from "../../../domain/entities/User";

export interface SigninRequestDto {
  login_id: string;
  password: string;
}

export interface SigninResponseDto {
  success: boolean;
  message: string;
  user?: Omit<User, "password" | "created_at">;
}
