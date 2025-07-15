import { MovieInfoRepository } from "../../../domain/repositories/saves/MovieInfoRepository";
import {
  GetMovieInfoRequestDto,
  GetMovieInfoResponseDto,
} from "../dtos/GetMovieInfoDto";

/**
 * 영화 정보 조회 UseCase
 */
export class GetMovieInfoUseCase {
  constructor(private movieInfoRepository: MovieInfoRepository) {}

  /**
   * 영화 정보 조회 실행
   */
  async execute(
    request: GetMovieInfoRequestDto
  ): Promise<GetMovieInfoResponseDto> {
    const { movieId } = request;

    if (!movieId) {
      return {
        success: false,
        error: "영화 ID가 필요합니다.",
      };
    }

    // 리포지토리를 통해 영화 정보 조회
    const result = await this.movieInfoRepository.getMovieInfoById(movieId);

    if (!result.success) {
      return {
        success: false,
        error: result.error,
      };
    }

    // 성공적으로 영화 정보 조회 완료
    const { movieInfo } = result;

    return {
      success: true,
      data: {
        id: movieInfo.id,
        title: movieInfo.title,
        overview: movieInfo.overview,
        releaseDate: movieInfo.releaseDate,
      },
    };
  }
}
