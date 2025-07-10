import {
  MovieSearchRequest,
  MovieSearchResponse,
  MoviePosterRequest,
  MoviePosterResponse,
} from "../../entities/recommender/movie";

// 영화 정보 리포지토리 인터페이스
export interface MovieRepository {
  /**
   * 영화 제목으로 검색
   * @param request 검색 요청
   * @returns 검색 결과
   */
  searchMovies(request: MovieSearchRequest): Promise<MovieSearchResponse>;

  /**
   * 영화 포스터 URL을 생성
   * @param request 포스터 요청
   * @returns 포스터 URL
   */
  getMoviePosterUrl(request: MoviePosterRequest): Promise<MoviePosterResponse>;
}
