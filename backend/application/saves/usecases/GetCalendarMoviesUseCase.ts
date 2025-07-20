import { SavedMovieRepository } from "../../../domain/repositories/saves/SavedMovieRepository";
import { TmdbApi } from "../../../../utils/tmdb/TmdbApi";
import {
  CalendarMovieDto,
  CalendarResponseDto,
  TmdbMovieDetailDto,
} from "../dtos/CalendarDto";

/**
 * 캘린더 영화 조회 UseCase
 */
export class GetCalendarMoviesUseCase {
  constructor(private savedMovieRepository: SavedMovieRepository) {}

  /**
   * 특정 월의 캘린더 영화 목록 조회
   * @param userId 사용자 ID
   * @param year 년도
   * @param month 월 (1-12)
   * @returns 캘린더 영화 목록
   */
  async execute(
    userId: string,
    year: number,
    month: number
  ): Promise<CalendarResponseDto> {
    try {
      // 1. DB에서 해당 월의 저장된 영화 목록 조회
      const savedMovies = await this.savedMovieRepository.findByUserIdAndMonth(
        userId,
        year,
        month
      );

      if (savedMovies.length === 0) {
        return {
          success: true,
          message: "해당 월에 저장된 영화가 없습니다.",
          movies: [],
        };
      }

      // 2. TMDB API 병렬 호출
      const movieDetailsPromises = savedMovies.map(async (savedMovie) => {
        try {
          const movieDetail = (await TmdbApi.getMovieDetails(
            savedMovie.movieId
          )) as TmdbMovieDetailDto;
          return {
            movieId: savedMovie.movieId,
            title: movieDetail.title,
            posterUrl: movieDetail.poster_path
              ? `https://image.tmdb.org/t/p/w500${movieDetail.poster_path}`
              : "/assets/images/no_poster_image.png",
            savedAt: savedMovie.savedAt,
          } as CalendarMovieDto;
        } catch (error) {
          console.error(
            `TMDB API 호출 실패 (movieId: ${savedMovie.movieId}):`,
            error
          );
          // TMDB API 호출 실패 시 기본 정보 반환
          return {
            movieId: savedMovie.movieId,
            title: `영화 ID: ${savedMovie.movieId}`,
            posterUrl: "/assets/images/no_poster_image.png",
            savedAt: savedMovie.savedAt,
          } as CalendarMovieDto;
        }
      });

      // 3. 모든 TMDB API 호출을 병렬로 실행
      const movieDetails = await Promise.all(movieDetailsPromises);

      // 4. 날짜별로 정렬
      const sortedMovies = movieDetails.sort((a, b) =>
        a.savedAt.localeCompare(b.savedAt)
      );

      return {
        success: true,
        message: "캘린더 영화 목록을 성공적으로 조회했습니다.",
        movies: sortedMovies,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "알 수 없는 오류";
      console.error("캘린더 영화 조회 중 오류:", error);

      return {
        success: false,
        message: `캘린더 영화 조회 중 오류가 발생했습니다: ${errorMessage}`,
      };
    }
  }
}
