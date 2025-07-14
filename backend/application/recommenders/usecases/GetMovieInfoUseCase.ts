import {
  MovieInfo,
  RecommendedMovie,
} from "../../../domain/entities/recommenders/movie";
import { SearchRepositoryImpl } from "../../../infrastructure/repositories/SearchRepositoryImpl";
import { MovieOrTvResult } from "../../../domain/entities/SearchResult";
import {
  SearchMovieByTitleRequestDto,
  SearchMovieByTitleResponseDto,
  GetRecommendedMoviesRequestDto,
  GetRecommendedMoviesResponseDto,
  GetSingleMovieInfoRequestDto,
  GetSingleMovieInfoResponseDto,
  GetMoviePosterUrlRequestDto,
  GetMoviePosterUrlResponseDto,
} from "../dtos/GetMovieInfoDto";

/**
 * 영화 정보 UseCase
 * 팀원의 SearchRepositoryImpl을 사용하여 영화 정보를 검색하고 처리합니다
 */
export class GetMovieInfoUseCase {
  private searchRepository: SearchRepositoryImpl;

  constructor() {
    // 팀원이 만든 SearchRepositoryImpl 사용
    this.searchRepository = new SearchRepositoryImpl();
  }

  /**
   * 영화 제목으로 검색하여 첫 번째 결과를 반환 (메인 메서드)
   * @param request 영화 제목 검색 요청 DTO
   * @returns 영화 정보 응답 DTO
   */
  async searchMovieByTitle(
    request: SearchMovieByTitleRequestDto
  ): Promise<SearchMovieByTitleResponseDto> {
    try {
      console.log("🎬 팀원 TMDB API: 영화 검색 요청:", request.title);

      // 팀원의 SearchRepositoryImpl 사용
      const response = await this.searchRepository.searchMulti(
        request.title,
        1
      );

      // 영화만 필터링 (TV 프로그램, 인물 제외)
      const movieResults = response.results.filter(
        (item) => item.media_type === "movie"
      ) as MovieOrTvResult[];

      if (movieResults.length > 0) {
        const movie = movieResults[0];

        // SearchResult를 MovieInfo로 변환
        const movieInfo: MovieInfo = {
          id: movie.id,
          title: movie.title || movie.name || "제목 없음",
          originalTitle: movie.title || movie.name || "제목 없음",
          overview: movie.overview || "",
          releaseDate: movie.release_date || "",
          posterPath: movie.poster_path || null,
          backdropPath: movie.backdrop_path || null,
          voteAverage: 0, // SearchResult에는 없는 정보
          voteCount: 0, // SearchResult에는 없는 정보
          popularity: 0, // SearchResult에는 없는 정보
          adult: false, // SearchResult에는 없는 정보
          genreIds: movie.genre_ids || [],
          originalLanguage: "ko", // SearchResult에는 없는 정보
        };

        return {
          success: true,
          data: movieInfo,
          timestamp: new Date().toISOString(),
        };
      }

      return {
        success: false,
        error: "검색 결과가 없습니다.",
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error(
        `팀원 TMDB API 영화 검색 중 오류 (${request.title}):`,
        error
      );
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "영화 검색 중 오류가 발생했습니다.",
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * 영화 포스터 URL 생성
   * @param request 영화 포스터 URL 요청 DTO
   * @returns 영화 포스터 URL 응답 DTO
   */
  async getMoviePosterUrl(
    request: GetMoviePosterUrlRequestDto
  ): Promise<GetMoviePosterUrlResponseDto> {
    try {
      if (!request.posterPath) {
        return {
          success: false,
          error: "포스터 경로가 제공되지 않았습니다.",
          timestamp: new Date().toISOString(),
        };
      }

      const baseUrl = "https://image.tmdb.org/t/p/";
      const size = request.size || "w500";
      const fullUrl = `${baseUrl}${size}${request.posterPath}`;

      return {
        success: true,
        data: fullUrl,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "포스터 URL 생성 중 오류가 발생했습니다.",
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * 추천 영화 목록 정보 처리
   * @param request 추천 영화 목록 요청 DTO
   * @returns 추천 영화 목록 응답 DTO
   */
  async getRecommendedMoviesInfo(
    request: GetRecommendedMoviesRequestDto
  ): Promise<GetRecommendedMoviesResponseDto> {
    try {
      const movieResults: RecommendedMovie[] = [];

      for (const title of request.movieTitles) {
        const movieInfo = await this.getSingleMovieInfo({ title });

        if (movieInfo.success && movieInfo.data) {
          movieResults.push(movieInfo.data);
        } else {
          // 검색 실패한 영화도 포함 (검색 실패 상태로)
          movieResults.push({
            title: this.normalizeMovieTitle(title),
            searchStatus: "not_found",
          });
        }
      }

      return {
        success: true,
        data: movieResults,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "추천 영화 정보 처리 중 오류가 발생했습니다.",
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * 단일 영화 정보 처리
   * @param request 단일 영화 정보 요청 DTO
   * @returns 단일 영화 정보 응답 DTO
   */
  async getSingleMovieInfo(
    request: GetSingleMovieInfoRequestDto
  ): Promise<GetSingleMovieInfoResponseDto> {
    try {
      const normalizedTitle = this.normalizeMovieTitle(request.title);

      // 영화 정보 검색
      const movieSearchResult = await this.searchMovieByTitle({
        title: normalizedTitle,
      });

      if (movieSearchResult.success && movieSearchResult.data) {
        const movie = movieSearchResult.data;

        // 포스터 URL 생성
        let posterUrl: string | undefined = undefined;
        if (movie.posterPath) {
          const posterResult = await this.getMoviePosterUrl({
            posterPath: movie.posterPath,
            size: "w500",
          });

          if (posterResult.success && posterResult.data) {
            posterUrl = posterResult.data;
          }
        }

        // 완성된 영화 정보
        const completeMovie: RecommendedMovie = {
          title: normalizedTitle,
          searchStatus: "found",
          movieInfo: movie,
          posterUrl: posterUrl,
        };

        return {
          success: true,
          data: completeMovie,
          timestamp: new Date().toISOString(),
        };
      } else {
        // 검색 실패
        const notFoundMovie: RecommendedMovie = {
          title: normalizedTitle,
          searchStatus: "not_found",
        };

        return {
          success: true,
          data: notFoundMovie,
          timestamp: new Date().toISOString(),
        };
      }
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "영화 정보 처리 중 오류가 발생했습니다.",
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * 영화 제목을 정규화합니다
   * @param title 원본 영화 제목
   * @returns 정규화된 영화 제목
   */
  private normalizeMovieTitle(title: string): string {
    return title
      .trim()
      .replace(/[^\w\s가-힣ㄱ-ㅎㅏ-ㅣ\-:]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }
}
