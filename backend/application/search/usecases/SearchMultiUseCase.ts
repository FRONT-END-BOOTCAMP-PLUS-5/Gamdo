import { SearchRepository } from "@/backend/domain/repositories/movies/SearchRepository";
import { SearchResponse } from "@/backend/domain/entities/movies/SearchResult";

export class SearchMultiUseCase {
  constructor(private searchRepository: SearchRepository) {}

  async execute(query: string, page: number = 1): Promise<SearchResponse> {
    if (!query || query.trim().length === 0) {
      throw new Error("검색어가 필요합니다.");
    }

    if (page < 1) {
      throw new Error("페이지 번호는 1 이상이어야 합니다.");
    }

    return await this.searchRepository.searchMulti(query, page);
  }
}
