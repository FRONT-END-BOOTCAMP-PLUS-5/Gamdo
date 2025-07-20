export interface SignupRequestDto {
  name: string;
  loginId: string;
  password: string;
  nickname: string;
  profileImage: string | null;
}

export interface SignupResponseDto {
  userId: string;
  name: string;
  loginId: string;
  nickname: string;
  profileImage: string | null;
  role: string;
  createdAt: string;
}
