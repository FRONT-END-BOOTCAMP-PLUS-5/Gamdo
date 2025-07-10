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

// 영화 검색 요청 DTO
export interface MovieSearchRequest {
  query: string;
  language?: string;
  page?: number;
  includeAdult?: boolean;
}

// 영화 검색 응답 DTO
export interface MovieSearchResponse {
  success: boolean;
  data?: {
    results: MovieInfo[];
    totalResults: number;
  };
  error?: string;
}

// 영화 포스터 요청 DTO
export interface MoviePosterRequest {
  posterPath: string;
  size?: "w92" | "w154" | "w185" | "w342" | "w500" | "w780" | "original";
}

// 영화 포스터 응답 DTO
export interface MoviePosterResponse {
  success: boolean;
  data?: {
    posterUrl: string;
  };
  error?: string;
}
