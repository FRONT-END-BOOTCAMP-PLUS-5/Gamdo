// 영화 저장 요청 DTO
export interface SaveMovieRequestDto {
  movieId: string;
  selectedDate: string; // YYYY-MM-DD 형식
}

// 영화 저장 응답 DTO
export interface SaveMovieResponseDto {
  success: boolean;
  message: string;
  savedMovie?: {
    savedMovieId: string;
    userId: string;
    movieId: string;
    selectedDate: string;
    posterImageUrl: string;
    createdAt: string;
  };
}

// 영화 포스터 정보 DTO
export interface MoviePosterDto {
  movieId: string;
  posterPath: string;
  fullPosterUrl: string;
}
