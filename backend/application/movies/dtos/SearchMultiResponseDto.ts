// 통합검색 API 결과를 위한 DTO 정의

export interface MovieDto {
  id: number;
  media_type: "movie" | "tv";
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  genre_ids: number[];
}

export interface PersonKnownForDto {
  id: number;
  media_type: "movie" | "tv";
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  genre_ids: number[];
}

export interface PersonDto {
  id: number;
  media_type: "person";
  name: string;
  profile_path: string;
  known_for: PersonKnownForDto[];
}

export type SearchMultiResultDto = MovieDto | PersonDto;

export interface SearchMultiResponseDto {
  page: number;
  results: SearchMultiResultDto[];
  total_pages: number;
  total_results: number;
}
