/**
 * 캘린더 영화 정보 DTO
 */
export interface CalendarMovieDto {
  movieId: string;
  title: string;
  posterUrl: string;
  savedAt: string; // YYYY-MM-DD 형식
}

/**
 * 캘린더 조회 요청 DTO
 */
export interface CalendarRequestDto {
  year: number;
  month: number; // 1-12
}

/**
 * 캘린더 조회 응답 DTO
 */
export interface CalendarResponseDto {
  success: boolean;
  message: string;
  movies?: CalendarMovieDto[];
}

/**
 * TMDB 영화 상세 정보 DTO
 */
export interface TmdbMovieDetailDto {
  id: number;
  title: string;
  poster_path: string | null;
  overview: string;
  release_date: string;
}
