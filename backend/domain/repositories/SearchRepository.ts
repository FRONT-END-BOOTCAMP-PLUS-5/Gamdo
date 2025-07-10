import { SearchResponse } from "../entities/SearchResult";

export interface SearchRepository {
  searchMulti(query: string, page: number): Promise<SearchResponse>;
}
