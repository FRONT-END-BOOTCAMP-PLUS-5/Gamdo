/**
 * 영화 포스터 정보 조회 요청 DTO
 */
export interface GetMoviePosterRequestDto {
  movieId: string;
}

/**
 * 영화 포스터 정보 조회 응답 DTO
 */
export interface GetMoviePosterResponseDto {
  success: boolean;
  data?: {
    id: number;
    title: string;
    posterUrl: string | null;
    backdropUrl: string | null;
    overview: string;
    releaseDate: string;
  };
  error?: string;
}
