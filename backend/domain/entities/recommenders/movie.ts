// 영화 정보 엔티티
export interface MovieInfo {
  id: number;
  title: string;
  originalTitle: string;
  overview: string;
  releaseDate: string;
  posterPath: string | null;
  backdropPath: string | null;
  voteAverage: number;
  voteCount: number;
  popularity: number;
  adult: boolean;
  genreIds: number[];
  originalLanguage: string;
}

// 영화 검색 요청
export interface MovieSearchRequest {
  query: string;
  language?: string;
  page?: number;
  includeAdult?: boolean;
  region?: string;
  year?: number;
  primaryReleaseYear?: number;
}

// 영화 검색 응답
export interface MovieSearchResponse {
  success: boolean;
  data?: {
    page: number;
    results: MovieInfo[];
    totalPages: number;
    totalResults: number;
  };
  error?: string;
}

// 영화 상세 정보 요청
export interface MovieDetailRequest {
  movieId: number;
  language?: string;
}

// 영화 상세 정보 응답
export interface MovieDetailResponse {
  success: boolean;
  data?: MovieInfo;
  error?: string;
}

// 영화 포스터 URL 생성을 위한 설정
export interface MovieImageConfig {
  baseUrl: string;
  secureBaseUrl: string;
  backdropSizes: string[];
  logoSizes: string[];
  posterSizes: string[];
  profileSizes: string[];
  stillSizes: string[];
}

// 영화 포스터 URL 생성 요청
export interface MoviePosterRequest {
  posterPath: string;
  size?: "w92" | "w154" | "w185" | "w342" | "w500" | "w780" | "original";
}

// 영화 포스터 URL 응답
export interface MoviePosterResponse {
  success: boolean;
  data?: {
    posterUrl: string;
    originalUrl: string;
  };
  error?: string;
}

// 추천 영화 목록 (AI 응답 처리용)
export interface RecommendedMovie {
  title: string;
  movieInfo?: MovieInfo;
  posterUrl?: string;
  searchStatus: "pending" | "searching" | "found" | "not_found" | "error";
  error?: string;
}
