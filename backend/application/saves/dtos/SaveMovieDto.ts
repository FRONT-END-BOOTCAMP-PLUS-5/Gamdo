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
    userId: string;
    movieId: string;
    savedAt: string;
  };
}
