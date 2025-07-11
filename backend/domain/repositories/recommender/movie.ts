import {
  MovieSearchRequest,
  MovieSearchResponse,
  MovieDetailRequest,
  MovieDetailResponse,
  MoviePosterRequest,
  MoviePosterResponse,
  MovieImageConfig,
} from "../../entities/recommender/movie";

// 영화 정보 리포지토리 인터페이스
export interface MovieRepository {
  /**
   * 영화 제목으로 검색합니다
   * @param request 검색 요청
   * @returns 검색 결과
   */
  searchMovies(request: MovieSearchRequest): Promise<MovieSearchResponse>;

  /**
   * 영화 ID로 상세 정보를 가져옵니다
   * @param request 상세 정보 요청
   * @returns 상세 정보 응답
   */
  getMovieDetails(request: MovieDetailRequest): Promise<MovieDetailResponse>;

  /**
   * 영화 포스터 URL을 생성합니다
   * @param request 포스터 요청
   * @returns 포스터 URL
   */
  getMoviePosterUrl(request: MoviePosterRequest): Promise<MoviePosterResponse>;

  /**
   * TMDB 이미지 설정을 가져옵니다
   * @returns 이미지 설정
   */
  getImageConfiguration(): Promise<{
    success: boolean;
    data?: MovieImageConfig;
    error?: string;
  }>;
}
