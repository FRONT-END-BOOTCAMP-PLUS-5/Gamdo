import { MovieRepository } from "@/backend/domain/repositories/movies/MovieRepository";
import {
  MovieDetailDto,
  CreditsDto,
  OttListDto,
  DirectorDto,
  MainCastDto,
  CertificationDto,
} from "@/backend/application/movies/dtos/MovieDetailDto";
import { TmdbApi } from "@/utils/tmdb/TmdbApi";

export class MovieRepositoryImpl implements MovieRepository {
  async getMovieDetailsById(id: number): Promise<MovieDetailDto | null> {
    try {
      const data = await TmdbApi.getMovieDetails(id.toString());
      if (!data || data.id === undefined) return null;
      return {
        id: data.id,
        title: data.title,
        poster_path: data.poster_path,
        release_date: data.release_date,
        genres: data.genres,
        runtime: data.runtime,
        overview: data.overview,
        credits: null,
        ott: null,
        certification: null,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "알 수 없는 오류";
      throw new Error(
        `[MovieRepositoryImpl] 영화 상세정보 조회 중 오류: ${errorMessage}`
      );
    }
  }

  async getCreditsById(id: number): Promise<CreditsDto | null> {
    try {
      const data = await TmdbApi.getMovieCredits(id.toString());
      if (!data || data.id === undefined) return null;
      const director = Array.isArray(data.crew)
        ? data.crew.find((c: { job: string }) => c.job === "Director")
        : null;
      const directorDto: DirectorDto | null = director
        ? {
            id: director.id,
            name: director.name,
            profile_path: director.profile_path || null,
          }
        : null;
      const mainCast: MainCastDto[] = Array.isArray(data.cast)
        ? data.cast
            .slice(0, 2)
            .map(
              (c: {
                id: number;
                name: string;
                profile_path: string | null;
              }) => ({
                id: c.id,
                name: c.name,
                profile_path: c.profile_path || null,
              })
            )
        : [];
      return {
        id: data.id,
        director: directorDto,
        main_cast: mainCast,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "알 수 없는 오류";
      throw new Error(
        `[MovieRepositoryImpl] 출연진 정보 조회 중 오류: ${errorMessage}`
      );
    }
  }

  async getOttById(id: number): Promise<OttListDto | null> {
    try {
      const data = await TmdbApi.getMovieWatchProviders(id.toString());
      if (!data || data.id === undefined) return null;
      const kr = data.results?.KR;
      const ottProviders: string[] = Array.isArray(kr?.flatrate)
        ? kr.flatrate.map((p: { provider_name: string }) => p.provider_name)
        : [];
      return {
        id: data.id,
        ott_providers: ottProviders,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "알 수 없는 오류";
      throw new Error(
        `[MovieRepositoryImpl] OTT 정보 조회 중 오류: ${errorMessage}`
      );
    }
  }

  async getCertificationById(id: number): Promise<CertificationDto | null> {
    try {
      const data = await TmdbApi.getMovieReleaseDates(id.toString());
      if (!data || data.id === undefined) return null;
      const kr = Array.isArray(data.results)
        ? data.results.find(
            (r: { iso_3166_1: string }) => r.iso_3166_1 === "KR"
          )
        : null;
      const cert =
        Array.isArray(kr?.release_dates) && kr.release_dates.length > 0
          ? kr.release_dates[0].certification
          : "";
      return {
        id: data.id,
        certification: cert,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "알 수 없는 오류";
      throw new Error(
        `[MovieRepositoryImpl] 등급 정보 조회 중 오류: ${errorMessage}`
      );
    }
  }
}
