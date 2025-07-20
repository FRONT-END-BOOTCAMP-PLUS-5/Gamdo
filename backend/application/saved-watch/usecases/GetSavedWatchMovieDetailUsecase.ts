import { SavedWatch } from "@/backend/domain/entities/SavedWatch";
import { SavedWatchRepository } from "@/backend/domain/repositories/SavedWatchRepository";

export interface GetSavedWatchMovieDetailResponseDto {
  success: boolean;
  isSaved: boolean;
  savedWatch: SavedWatch | null;
  message: string;
}

export class GetSavedWatchMovieDetailUsecase {
  constructor(private savedWatchRepository: SavedWatchRepository) {}

  async execute(
    userId: string,
    movieId: string
  ): Promise<GetSavedWatchMovieDetailResponseDto> {
    try {
      // 1. 파라미터 검증
      if (!userId || !movieId) {
        return {
          success: false,
          isSaved: false,
          savedWatch: null,
          message: "사용자 ID와 영화 ID가 필요합니다.",
        };
      }

      // 2. 해당 유저가 특정 영화를 찜했는지 확인
      const savedWatch = await this.savedWatchRepository.findByUserIdAndMovieId(
        userId,
        movieId
      );

      // 3. 찜한 데이터가 있는 경우
      if (savedWatch) {
        return {
          success: true,
          isSaved: true,
          savedWatch: savedWatch,
          message: "해당 영화를 찜했습니다.",
        };
      }

      // 4. 찜하지 않은 경우
      return {
        success: true,
        isSaved: false,
        savedWatch: null,
        message: "해당 영화를 찜하지 않았습니다.",
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "알 수 없는 오류";
      return {
        success: false,
        isSaved: false,
        savedWatch: null,
        message: `찜하기 상태 조회 중 오류가 발생했습니다: ${errorMessage}`,
      };
    }
  }
}
