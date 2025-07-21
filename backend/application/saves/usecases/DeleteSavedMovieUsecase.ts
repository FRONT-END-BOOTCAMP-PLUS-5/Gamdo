import { SavedMovieRepository } from "../../../domain/repositories/saves/SavedMovieRepository";

/**
 * 영화 삭제 요청 DTO
 */
export interface DeleteSavedMovieRequestDto {
  movieId: string;
}

/**
 * 영화 삭제 응답 DTO
 */
export interface DeleteSavedMovieResponseDto {
  success: boolean;
  message: string;
}

/**
 * 영화 삭제 UseCase
 */
export class DeleteSavedMovieUsecase {
  constructor(private savedMovieRepository: SavedMovieRepository) {}

  /**
   * 영화 삭제 로직 실행
   * @param userId 사용자 ID (JWT 토큰에서 추출된)
   * @param data 영화 삭제 요청 데이터
   * @returns 영화 삭제 결과
   */
  async execute(
    userId: string,
    data: DeleteSavedMovieRequestDto
  ): Promise<DeleteSavedMovieResponseDto> {
    try {
      const { movieId } = data;

      // 1. 영화 ID 검증
      if (!movieId) {
        return {
          success: false,
          message: "영화 ID가 필요합니다.",
        };
      }

      // 2. 해당 영화가 저장되어 있는지 확인
      const existingMovies =
        await this.savedMovieRepository.findByUserIdAndMovieId(userId, movieId);

      if (existingMovies.length === 0) {
        return {
          success: false,
          message: "저장된 영화를 찾을 수 없습니다.",
        };
      }

      // 3. 영화 삭제 실행
      const deleteResult =
        await this.savedMovieRepository.deleteByUserIdAndMovieId(
          userId,
          movieId
        );

      if (deleteResult) {
        return {
          success: true,
          message: "영화가 성공적으로 삭제되었습니다.",
        };
      } else {
        return {
          success: false,
          message: "영화 삭제에 실패했습니다.",
        };
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "알 수 없는 오류";
      return {
        success: false,
        message: `영화 삭제 중 오류가 발생했습니다: ${errorMessage}`,
      };
    }
  }
}
