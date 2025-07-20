import { SearchRepositoryImpl } from "@/backend/infrastructure/repositories/movies/SearchRepositoryImpl";
import {
  SearchMultiResponseDto,
  MovieDto,
} from "@/backend/application/movies/dtos/SearchMultiResponseDto";

export class GetSearchResultsUseCase {
  private searchRepository: SearchRepositoryImpl;

  constructor() {
    this.searchRepository = new SearchRepositoryImpl();
  }

  async execute(query: string): Promise<MovieDto | null> {
    const response: SearchMultiResponseDto =
      await this.searchRepository.searchMulti(query, 1);
    // 첫 번째 영화 결과만 반환
    const movie = response.results.find(
      (item) => item.media_type === "movie"
    ) as MovieDto | undefined;
    return movie || null;
  }
}
