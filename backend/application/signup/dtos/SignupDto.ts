// backend/application/dtos/SignupDto.ts
export interface SignupRequestDto {
  name: string;
  login_id: string;
  password: string;
  nickname: string;
  profile_image: string | null;
}

export interface SignupResponseDto {
  user_id: string;
  name: string;
  login_id: string;
  nickname: string;
  profile_image: string | null;
  role: string;
  created_at: string;
}
