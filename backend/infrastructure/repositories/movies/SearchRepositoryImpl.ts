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
      const response = (await TmdbApi.searchMulti(query, page)) as unknown;
      // TMDB 원본 데이터를 DTO로 변환
      if (
        typeof response === "object" &&
        response !== null &&
        "results" in response &&
        Array.isArray((response as { results?: unknown }).results)
      ) {
        const resultsArr = (response as { results?: unknown })
          .results as unknown[];
        const mappedResults: SearchMultiResultDto[] = resultsArr
          .map((item) => {
            if (
              typeof item === "object" &&
              item !== null &&
              "media_type" in item
            ) {
              if (
                (item as { media_type?: string }).media_type === "movie" ||
                (item as { media_type?: string }).media_type === "tv"
              ) {
                return {
                  id: (item as unknown as { id: number }).id,
                  media_type: (item as { media_type: string }).media_type,
                  title: (item as { title?: string }).title,
                  overview: (item as { overview?: string }).overview,
                  poster_path: (item as { poster_path?: string }).poster_path,
                  backdrop_path: (item as { backdrop_path?: string })
                    .backdrop_path,
                  release_date: (item as { release_date?: string })
                    .release_date,
                  genre_ids: (item as { genre_ids?: number[] }).genre_ids,
                } as MovieDto;
              } else if (
                (item as { media_type?: string }).media_type === "person"
              ) {
                return {
                  id: (item as unknown as { id: number }).id,
                  media_type: (item as { media_type: string }).media_type,
                  name: (item as { name?: string }).name,
                  profile_path: (item as { profile_path?: string })
                    .profile_path,
                  known_for: Array.isArray(
                    (item as { known_for?: unknown }).known_for
                  )
                    ? ((
                        (item as { known_for?: unknown }).known_for as unknown[]
                      ).map((kf) => ({
                        id: (kf as unknown as { id: number }).id,
                        media_type: (kf as { media_type: string }).media_type,
                        title: (kf as { title?: string }).title,
                        overview: (kf as { overview?: string }).overview,
                        poster_path: (kf as { poster_path?: string })
                          .poster_path,
                        backdrop_path: (kf as { backdrop_path?: string })
                          .backdrop_path,
                        release_date: (kf as { release_date?: string })
                          .release_date,
                        genre_ids: (kf as { genre_ids?: number[] }).genre_ids,
                      })) as PersonKnownForDto[])
                    : [],
                } as PersonDto;
              }
            }
            return undefined;
          })
          .filter(Boolean) as SearchMultiResultDto[];
        return {
          page: (response as { page?: number }).page ?? 1,
          results: mappedResults,
          total_pages: (response as { total_pages?: number }).total_pages ?? 1,
          total_results:
            (response as { total_results?: number }).total_results ?? 0,
        };
      }
      throw new Error("검색 결과가 올바르지 않습니다.");
    } catch (error) {
      console.error("TMDB API 검색 에러:", error);
      throw new Error("검색 중 오류가 발생했습니다.");
    }
  }
}
