import { MovieInfoResult } from "../../entities/saves/MovieInfo";

/**
 * 영화 정보 리포지토리 인터페이스
 */
export interface MovieInfoRepository {
  /**
   * 영화 ID로 TMDB API에서 영화 정보 조회
   */
  getMovieInfoById(movieId: string): Promise<MovieInfoResult>;
}
