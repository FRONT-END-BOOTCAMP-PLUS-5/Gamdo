// 영화/TV 작품 결과 타입
export type MovieOrTvResult = {
  id: number;
  media_type: "movie" | "tv";
  title?: string;
  name?: string;
  overview: string;
  poster_path?: string;
  backdrop_path?: string;
  release_date?: string;
  genre_ids?: number[];
};

// 인물(person) 결과 타입
export type PersonResult = {
  id: number;
  media_type: "person";
  name: string;
  profile_path?: string;
  known_for: MovieOrTvResult[];
};

// 통합 검색 결과 유니언 타입
export type SearchResult = MovieOrTvResult | PersonResult;

export interface SearchResponse {
  page: number;
  results: SearchResult[];
  total_pages: number;
  total_results: number;
}
