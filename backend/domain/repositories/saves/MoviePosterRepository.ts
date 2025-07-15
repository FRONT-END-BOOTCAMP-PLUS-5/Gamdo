import { MoviePosterResult } from "../../entities/saves/MoviePoster";

/**
 * 영화 포스터 리포지토리 인터페이스
 */
export interface MoviePosterRepository {
  /**
   * 영화 ID로 TMDB API에서 포스터 정보 조회
   */
  getMoviePosterById(movieId: string): Promise<MoviePosterResult>;
}
