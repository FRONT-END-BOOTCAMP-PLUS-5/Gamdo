import {
  MovieInfo,
  RecommendedMovie,
} from "../../../domain/entities/recommenders/movie";

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
