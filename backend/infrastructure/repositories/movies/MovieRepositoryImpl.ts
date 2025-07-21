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
      const data = (await TmdbApi.getMovieDetails(id.toString())) as unknown;

      if (
        typeof data === "object" &&
        data !== null &&
        "id" in data &&
        typeof (data as { id: unknown }).id === "number"
      ) {
        return {
          id: (data as { id: number }).id,
          title: (data as { title?: string }).title ?? "",
          poster_path:
            (data as { poster_path?: string | null }).poster_path ?? null,
          backdrop_path:
            (data as { backdrop_path?: string | null }).backdrop_path ?? null,
          release_date: (data as { release_date?: string }).release_date ?? "",
          genres: Array.isArray((data as { genres?: unknown }).genres)
            ? ((data as { genres?: unknown }).genres as {
                id: number;
                name: string;
              }[])
            : [],
          runtime: (data as { runtime?: number }).runtime ?? 0,
          overview: (data as { overview?: string }).overview ?? "",
          credits: null,
          ott: null,
          certification: null,
        };
      }
      return null;
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
      const data = (await TmdbApi.getMovieCredits(id.toString())) as unknown;
      if (
        typeof data === "object" &&
        data !== null &&
        "id" in data &&
        "crew" in data &&
        "cast" in data
      ) {
        const crewArr = (data as { crew?: unknown }).crew;
        const castArr = (data as { cast?: unknown }).cast;
        const director = Array.isArray(crewArr)
          ? (
              crewArr as {
                id: number;
                name: string;
                job: string;
                profile_path: string | null;
              }[]
            ).find((c) => c.job === "Director")
          : null;
        const directorDto: DirectorDto | null = director
          ? {
              id: director.id,
              name: director.name,
              profile_path: director.profile_path || null,
            }
          : null;
        const mainCast: MainCastDto[] = Array.isArray(castArr)
          ? (
              castArr as {
                id: number;
                name: string;
                profile_path: string | null;
              }[]
            )
              .slice(0, 2)
              .map((c) => ({
                id: c.id,
                name: c.name,
                profile_path: c.profile_path || null,
              }))
          : [];
        return {
          id: (data as { id: number }).id,
          director: directorDto,
          main_cast: mainCast,
        };
      }
      return null;
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
      const data = (await TmdbApi.getMovieWatchProviders(
        id.toString()
      )) as unknown;
      if (
        typeof data === "object" &&
        data !== null &&
        "id" in data &&
        "results" in data
      ) {
        const results = (data as { results?: unknown }).results;
        const kr =
          results &&
          typeof results === "object" &&
          results !== null &&
          "KR" in results
            ? (results as Record<string, unknown>)["KR"]
            : undefined;
        const ottProviders: string[] = Array.isArray(
          (kr as { flatrate?: unknown } | undefined)?.flatrate
        )
          ? (
              (kr as { flatrate?: unknown }).flatrate as {
                provider_name: string;
              }[]
            ).map((p) => p.provider_name)
          : [];
        return {
          id: (data as { id: number }).id,
          ott_providers: ottProviders,
        };
      }
      return null;
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
      const data = (await TmdbApi.getMovieReleaseDates(
        id.toString()
      )) as unknown;
      if (
        typeof data === "object" &&
        data !== null &&
        "id" in data &&
        "results" in data
      ) {
        const results = (data as { results?: unknown }).results;
        const kr = Array.isArray(results)
          ? (results as unknown[]).find(
              (r) =>
                typeof r === "object" &&
                r !== null &&
                "iso_3166_1" in r &&
                (r as { iso_3166_1?: string }).iso_3166_1 === "KR"
            )
          : null;
        let cert = "";
        if (
          kr &&
          typeof kr === "object" &&
          kr !== null &&
          "release_dates" in kr &&
          Array.isArray((kr as { release_dates?: unknown }).release_dates)
        ) {
          const releaseDatesArr = (kr as { release_dates?: unknown })
            .release_dates as unknown[];
          if (
            releaseDatesArr.length > 0 &&
            typeof releaseDatesArr[0] === "object" &&
            releaseDatesArr[0] !== null &&
            "certification" in releaseDatesArr[0]
          ) {
            cert =
              (releaseDatesArr[0] as { certification?: string })
                .certification ?? "";
          }
        }
        return {
          id: (data as { id: number }).id,
          certification: cert,
        };
      }
      return null;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "알 수 없는 오류";
      throw new Error(
        `[MovieRepositoryImpl] 등급 정보 조회 중 오류: ${errorMessage}`
      );
    }
  }
}
