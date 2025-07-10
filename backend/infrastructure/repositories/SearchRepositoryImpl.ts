import { SearchRepository } from "../../domain/repositories/SearchRepository";
import {
  SearchResponse,
  SearchResult,
} from "../../domain/entities/SearchResult";
import { TmdbApi } from "../../../utils/tmdb/TmdbApi";

export class SearchRepositoryImpl implements SearchRepository {
  async searchMulti(query: string, page: number): Promise<SearchResponse> {
    try {
      const response = await TmdbApi.searchMulti(query, page);
      // results를 SearchResult[]로 명시적으로 변환
      const mappedResults: SearchResult[] = response.results.map(
        (item: any) => item as SearchResult
      );
      return {
        ...response,
        results: mappedResults,
      };
    } catch (error) {
      console.error("TMDB API 검색 에러:", error);
      throw new Error("검색 중 오류가 발생했습니다.");
    }
  }
}
