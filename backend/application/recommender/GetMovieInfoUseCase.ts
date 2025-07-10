import { MovieRepository } from "../../domain/repositories/recommender/movie";
import { MovieInfo } from "../../domain/entities/recommender/movie";

/**
 * 영화 제목으로 영화 정보를 조회하는 UseCase
 */
export class GetMovieInfoUseCase {
  constructor(private movieRepository: MovieRepository) {}

  /**
   * 영화 제목으로 검색하여 영화 정보를 반환
   * @param title 영화 제목
   * @returns 영화 정보 또는 null
   */
  async execute(title: string): Promise<MovieInfo | null> {
    try {
      const searchResult = await this.movieRepository.searchMovies({
        query: title,
        language: "ko-KR",
        page: 1,
        includeAdult: false,
      });

      if (
        searchResult.success &&
        searchResult.data?.results &&
        searchResult.data.results.length > 0
      ) {
        return searchResult.data.results[0];
      }

      return null;
    } catch (error) {
      console.error(`영화 검색 중 오류 발생: ${title}`, error);
      return null;
    }
  }

  /**
   * 영화 포스터 URL을 생성
   * @param posterPath 포스터 경로
   * @param size 포스터 크기 (기본값: 'w500')
   * @returns 포스터 URL 또는 null
   */
  async getMoviePosterUrl(
    posterPath: string,
    size:
      | "w92"
      | "w154"
      | "w185"
      | "w342"
      | "w500"
      | "w780"
      | "original" = "w500"
  ): Promise<string | null> {
    try {
      if (!posterPath) {
        return null;
      }

      const posterResult = await this.movieRepository.getMoviePosterUrl({
        posterPath,
        size,
      });

      if (posterResult.success && posterResult.data) {
        return posterResult.data.posterUrl;
      }

      return null;
    } catch (error) {
      console.error("포스터 URL 생성 중 오류:", error);
      return null;
    }
  }
}
