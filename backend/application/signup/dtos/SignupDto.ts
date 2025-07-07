// backend/application/dtos/SignupDto.ts
export interface SignupRequestDto {
  name: string;
  login_id: string;
  password: string;
  nickname: string | null;
  profile_image: string | null;
}

export interface SignupResponseDto {
  name: string;
  login_id: string;
  nickname: string | null;
  profile_image: string | null;
  role: string;
  //   created_at: string;
}
