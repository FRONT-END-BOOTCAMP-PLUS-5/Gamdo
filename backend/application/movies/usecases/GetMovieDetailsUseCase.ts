import { MovieRepositoryImpl } from "@/backend/infrastructure/repositories/movies/MovieRepositoryImpl";
import { MovieDetailDto } from "@/backend/application/movies/dtos/MovieDetailDto";

export class GetMovieDetailsUseCase {
  private movieRepository: MovieRepositoryImpl;

  constructor() {
    this.movieRepository = new MovieRepositoryImpl();
  }

  async execute(id: number): Promise<MovieDetailDto | null> {
    // 1. 영화 기본 정보
    const detail = await this.movieRepository.getMovieDetailsById(id);
    if (!detail) return null;

    // 2. 출연진 정보
    const credits = await this.movieRepository.getCreditsById(id);

    // 3. OTT 정보
    const ott = await this.movieRepository.getOttById(id);

    // 4. 등급 정보
    const certification = await this.movieRepository.getCertificationById(id);

    // 5. 모든 정보를 합쳐서 반환
    return {
      ...detail,
      credits,
      ott,
      certification,
    };
  }
}
