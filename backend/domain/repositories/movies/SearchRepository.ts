import { SearchResponse } from "../../entities/movies/SearchResult";

export interface SearchRepository {
  searchMulti(query: string, page: number): Promise<SearchResponse>;
}
