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

      // 2. SavedMovie 엔티티 생성
      const savedMovie = new SavedMovie(
        userId,
        movieId,
        selectedDate // saved_at 컬럼에 저장될 날짜
      );

      // 3. 수파베이스 calendar 테이블에 저장
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
