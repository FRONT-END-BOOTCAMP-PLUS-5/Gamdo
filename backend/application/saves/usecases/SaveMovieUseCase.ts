import { SavedMovie } from "../../../domain/entities/saves/SavedMovie";
import { SavedMovieRepository } from "../../../domain/repositories/saves/SavedMovieRepository";
import {
  SaveMovieRequestDto,
  SaveMovieResponseDto,
} from "../dtos/SaveMovieDto";

/**
 * 영화 저장 UseCase
 */
export class SaveMovieUseCase {
  constructor(private savedMovieRepository: SavedMovieRepository) {}

  /**
   * 영화 저장 로직 실행
   * @param userId 사용자 ID (JWT 토큰에서 추출된)
   * @param data 영화 저장 요청 데이터
   * @returns 영화 저장 결과
   */
  async execute(
    userId: string,
    data: SaveMovieRequestDto
  ): Promise<SaveMovieResponseDto> {
    try {
      const { movieId, selectedDate } = data;

      // 1. 날짜 형식 검증 (YYYY-MM-DD)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(selectedDate)) {
        return {
          success: false,
          message:
            "날짜 형식이 올바르지 않습니다. (YYYY-MM-DD 형식을 사용하세요)",
        };
      }

      // 2. 같은 날짜에 다른 영화가 저장되어 있는지 확인
      const existingMoviesOnDate =
        await this.savedMovieRepository.findByUserIdAndDate(
          userId,
          selectedDate
        );

      if (existingMoviesOnDate.length > 0) {
        // 같은 날짜에 다른 영화가 저장되어 있음
        const existingMovie = existingMoviesOnDate[0];
        if (existingMovie.movieId !== movieId) {
          return {
            success: false,
            message: `해당 날짜(${selectedDate})에는 이미 다른 영화가 저장되어 있습니다.`,
          };
        }
        // 같은 영화가 같은 날짜에 저장되어 있으면 갱신 (이미 저장된 상태)
        return {
          success: true,
          message: "이미 해당 날짜에 저장된 영화입니다.",
          savedMovie: {
            userId: existingMovie.userId,
            movieId: existingMovie.movieId,
            savedAt: existingMovie.savedAt,
          },
        };
      }

      // 3. 같은 영화가 다른 날짜에 저장되어 있는지 확인하고 삭제
      const existingMovies =
        await this.savedMovieRepository.findByUserIdAndMovieId(userId, movieId);
      if (existingMovies.length > 0) {
        // 기존 저장된 영화 삭제
        for (const existingMovie of existingMovies) {
          await this.savedMovieRepository.deleteByUserIdAndMovieIdAndDate(
            userId,
            movieId,
            existingMovie.savedAt
          );
        }
      }

      // 4. SavedMovie 엔티티 생성
      const savedMovie = new SavedMovie(
        userId,
        movieId,
        selectedDate // saved_at 컬럼에 저장될 날짜
      );

      // 5. 수파베이스 calendar 테이블에 저장
      const result = await this.savedMovieRepository.save(savedMovie);

      return {
        success: true,
        message: "영화가 성공적으로 저장되었습니다.",
        savedMovie: {
          userId: result.userId,
          movieId: result.movieId,
          savedAt: result.savedAt,
        },
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "알 수 없는 오류";
      return {
        success: false,
        message: `영화 저장 중 오류가 발생했습니다: ${errorMessage}`,
      };
    }
  }
}
