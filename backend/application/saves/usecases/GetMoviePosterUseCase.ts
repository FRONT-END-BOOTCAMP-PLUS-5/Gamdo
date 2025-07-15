import { MoviePosterRepository } from "../../../domain/repositories/saves/MoviePosterRepository";
import {
  GetMoviePosterRequestDto,
  GetMoviePosterResponseDto,
} from "../dtos/GetMoviePosterDto";

/**
 * 영화 포스터 정보 조회 UseCase
 */
export class GetMoviePosterUseCase {
  constructor(private moviePosterRepository: MoviePosterRepository) {}

  /**
   * 영화 포스터 정보 조회 실행
   */
  async execute(
    request: GetMoviePosterRequestDto
  ): Promise<GetMoviePosterResponseDto> {
    const { movieId } = request;

    if (!movieId) {
      return {
        success: false,
        error: "영화 ID가 필요합니다.",
      };
    }

    // 리포지토리를 통해 영화 포스터 정보 조회
    const result = await this.moviePosterRepository.getMoviePosterById(movieId);

    if (!result.success) {
      return {
        success: false,
        error: result.error,
      };
    }

    // 성공적으로 영화 포스터 정보 조회 완료
    const { moviePoster } = result;

    return {
      success: true,
      data: {
        id: moviePoster.id,
        title: moviePoster.title,
        posterUrl: moviePoster.posterUrl,
        backdropUrl: moviePoster.backdropUrl,
        overview: moviePoster.overview,
        releaseDate: moviePoster.releaseDate,
      },
    };
  }
}
