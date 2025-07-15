/**
 * 영화 정보 조회 요청 DTO
 */
export interface GetMovieInfoRequestDto {
  movieId: string;
}

/**
 * 영화 정보 조회 응답 DTO
 */
export interface GetMovieInfoResponseDto {
  success: boolean;
  data?: {
    id: number;
    title: string;
    overview: string;
    releaseDate: string;
  };
  error?: string;
}
