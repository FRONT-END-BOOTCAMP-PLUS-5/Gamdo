import {
  MovieInfo,
  RecommendedMovie,
} from "../../../domain/entities/recommenders/movie";

// TMDB API의 새로운 응답 구조 DTO
export interface MovieDto {
  id: number;
  media_type: "movie" | "tv";
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  genre_ids: number[];
}

export interface PersonKnownForDto {
  id: number;
  media_type: "movie" | "tv";
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  genre_ids: number[];
}

export interface PersonDto {
  id: number;
  media_type: "person";
  name: string;
  profile_path?: string;
  known_for: PersonKnownForDto[];
}

export type SearchMultiResultDto = MovieDto | PersonDto;

export interface SearchMultiResponseDto {
  page: number;
  results: SearchMultiResultDto[];
  total_pages: number;
  total_results: number;
}

/**
 * 영화 제목 검색 요청 DTO
 */
export interface SearchMovieByTitleRequestDto {
  title: string;
}

/**
 * 영화 제목 검색 응답 DTO
 */
export interface SearchMovieByTitleResponseDto {
  success: boolean;
  data?: MovieInfo;
  error?: string;
  timestamp: string;
}

/**
 * 추천 영화 목록 요청 DTO
 */
export interface GetRecommendedMoviesRequestDto {
  movieTitles: string[];
}

/**
 * 추천 영화 목록 응답 DTO
 */
export interface GetRecommendedMoviesResponseDto {
  success: boolean;
  data?: RecommendedMovie[];
  error?: string;
  timestamp: string;
}

/**
 * 단일 영화 정보 요청 DTO
 */
export interface GetSingleMovieInfoRequestDto {
  title: string;
}

/**
 * 단일 영화 정보 응답 DTO
 */
export interface GetSingleMovieInfoResponseDto {
  success: boolean;
  data?: RecommendedMovie;
  error?: string;
  timestamp: string;
}

/**
 * 영화 포스터 URL 요청 DTO
 */
export interface GetMoviePosterUrlRequestDto {
  posterPath: string;
  size?: "w92" | "w154" | "w185" | "w342" | "w500" | "w780" | "original";
}

/**
 * 영화 포스터 URL 응답 DTO
 */
export interface GetMoviePosterUrlResponseDto {
  success: boolean;
  data?: string;
  error?: string;
  timestamp: string;
}
