import { SearchRepository } from "@/backend/domain/repositories/movies/SearchRepository";
import {
  SearchMultiResponseDto,
  SearchMultiResultDto,
  MovieDto,
  PersonDto,
  PersonKnownForDto,
} from "@/backend/application/movies/dtos/SearchMultiResponseDto";
import { TmdbApi } from "@/utils/tmdb/TmdbApi";

export class SearchRepositoryImpl implements SearchRepository {
  async searchMulti(
    query: string,
    page: number
  ): Promise<SearchMultiResponseDto> {
    try {
      const response = await TmdbApi.searchMulti(query, page);
      // TMDB 원본 데이터를 DTO로 변환
      const mappedResults: SearchMultiResultDto[] = (response.results || [])
        .map((item: any) => {
          if (item.media_type === "movie" || item.media_type === "tv") {
            return {
              id: item.id,
              media_type: item.media_type,
              title: item.title,
              overview: item.overview,
              poster_path: item.poster_path,
              backdrop_path: item.backdrop_path,
              release_date: item.release_date,
              genre_ids: item.genre_ids,
            } as MovieDto;
          } else if (item.media_type === "person") {
            return {
              id: item.id,
              media_type: item.media_type,
              name: item.name,
              profile_path: item.profile_path,
              known_for: (item.known_for || []).map((kf: any) => ({
                id: kf.id,
                media_type: kf.media_type,
                title: kf.title,
                overview: kf.overview,
                poster_path: kf.poster_path,
                backdrop_path: kf.backdrop_path,
                release_date: kf.release_date,
                genre_ids: kf.genre_ids,
              })) as PersonKnownForDto[],
            } as PersonDto;
          }
          return undefined;
        })
        .filter(Boolean) as SearchMultiResultDto[];
      return {
        page: response.page,
        results: mappedResults,
        total_pages: response.total_pages,
        total_results: response.total_results,
      };
    } catch (error) {
      console.error("TMDB API 검색 에러:", error);
      throw new Error("검색 중 오류가 발생했습니다.");
    }
  }
}
