import { TmdbApi } from "../../infrastructure/tmdb/TmdbApi";

export class GetMovieDetailsUseCase {
  private tmdbApi: typeof TmdbApi;

  constructor(tmdbApi: typeof TmdbApi) {
    this.tmdbApi = tmdbApi;
  }

  async execute(movieId: string): Promise<{ id: number; title: string }> {
    return this.tmdbApi.getMovieDetails(movieId);
  }
}
