import {
  MovieInfo,
  RecommendedMovie,
} from "../../domain/entities/recommender/movie";
import { SearchRepositoryImpl } from "../../infrastructure/repositories/SearchRepositoryImpl";
import { MovieOrTvResult } from "../../domain/entities/SearchResult";

// 영화 정보 처리 서비스 클래스 (팀원의 SearchRepositoryImpl 활용)
export class GetMovieInfoService {
  private searchRepository: SearchRepositoryImpl;

  constructor() {
    // 팀원이 만든 SearchRepositoryImpl 사용
    this.searchRepository = new SearchRepositoryImpl();
  }

  /**
   * 영화 제목으로 검색하여 첫 번째 결과를 반환합니다
   * @param title 영화 제목
   * @returns 영화 정보 또는 null
   */
  async searchMovieByTitle(title: string): Promise<MovieInfo | null> {
    try {
      console.log("🎬 팀원 TMDB API: 영화 검색 요청:", title);

      // 팀원의 SearchRepositoryImpl 사용
      const response = await this.searchRepository.searchMulti(title, 1);

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

        return movieInfo;
      }

      return null;
    } catch (error) {
      console.error(`팀원 TMDB API 영화 검색 중 오류 (${title}):`, error);
      return null;
    }
  }

  /**
   * 영화 포스터 URL을 생성합니다
   * @param posterPath 포스터 경로
   * @param size 포스터 크기 (기본값: 'w500')
   * @returns 포스터 URL 또는 null
   */
  async getMoviePosterUrl(
    posterPath: string,
    size:
      | "w92"
      | "w154"
      | "w185"
      | "w342"
      | "w500"
      | "w780"
      | "original" = "w500"
  ): Promise<string | null> {
    try {
      if (!posterPath) {
        return null;
      }

      // TMDB 이미지 URL 형식으로 생성
      const baseUrl = "https://image.tmdb.org/t/p/";
      const posterUrl = `${baseUrl}${size}${posterPath}`;

      return posterUrl;
    } catch (error) {
      console.error("포스터 URL 생성 중 오류:", error);
      return null;
    }
  }

  /**
   * AI 추천 영화 제목들을 받아서 영화 정보와 포스터를 가져옵니다
   * @param movieTitles 영화 제목 배열
   * @returns 추천 영화 정보 배열
   */
  async getRecommendedMoviesInfo(
    movieTitles: string[]
  ): Promise<RecommendedMovie[]> {
    const recommendedMovies: RecommendedMovie[] = movieTitles.map((title) => ({
      title,
      searchStatus: "pending",
    }));

    // 각 영화 제목에 대해 병렬로 검색 수행
    const searchPromises = recommendedMovies.map(async (movie, index) => {
      try {
        // 상태를 'searching'으로 변경
        recommendedMovies[index].searchStatus = "searching";

        // 영화 정보 검색 (팀원의 SearchRepositoryImpl 사용)
        const movieInfo = await this.searchMovieByTitle(movie.title);

        if (movieInfo) {
          // 영화 정보 저장
          recommendedMovies[index].movieInfo = movieInfo;
          recommendedMovies[index].searchStatus = "found";

          // 포스터 URL 생성
          if (movieInfo.posterPath) {
            const posterUrl = await this.getMoviePosterUrl(
              movieInfo.posterPath
            );
            if (posterUrl) {
              recommendedMovies[index].posterUrl = posterUrl;
            }
          }
        } else {
          recommendedMovies[index].searchStatus = "not_found";
        }
      } catch (error) {
        recommendedMovies[index].searchStatus = "error";
        recommendedMovies[index].error =
          error instanceof Error
            ? error.message
            : "영화 정보 검색 중 오류가 발생했습니다.";
      }
    });

    // 모든 검색이 완료될 때까지 대기
    await Promise.all(searchPromises);

    return recommendedMovies;
  }

  /**
   * 단일 영화 제목에 대한 정보를 가져옵니다 (실시간 검색용)
   * @param title 영화 제목
   * @returns 추천 영화 정보
   */
  async getSingleMovieInfo(title: string): Promise<RecommendedMovie> {
    const recommendedMovie: RecommendedMovie = {
      title,
      searchStatus: "searching",
    };

    try {
      // 영화 정보 검색 (팀원의 SearchRepositoryImpl 사용)
      const movieInfo = await this.searchMovieByTitle(title);

      if (movieInfo) {
        recommendedMovie.movieInfo = movieInfo;
        recommendedMovie.searchStatus = "found";

        // 포스터 URL 생성
        if (movieInfo.posterPath) {
          const posterUrl = await this.getMoviePosterUrl(movieInfo.posterPath);
          if (posterUrl) {
            recommendedMovie.posterUrl = posterUrl;
          }
        }
      } else {
        recommendedMovie.searchStatus = "not_found";
      }
    } catch (error) {
      recommendedMovie.searchStatus = "error";
      recommendedMovie.error =
        error instanceof Error
          ? error.message
          : "영화 정보 검색 중 오류가 발생했습니다.";
    }

    return recommendedMovie;
  }

  /**
   * 영화 제목 정규화 (검색 정확도 향상)
   * @param title 원본 영화 제목
   * @returns 정규화된 영화 제목
   */
  normalizeMovieTitle(title: string): string {
    return title
      .trim()
      .replace(/[""'']/g, "") // 따옴표 제거
      .replace(/\([^)]*\)/g, "") // 괄호와 괄호 안 내용 제거
      .replace(/\[[^\]]*\]/g, "") // 대괄호와 대괄호 안 내용 제거
      .replace(/\s+/g, " ") // 연속된 공백을 하나로
      .trim();
  }
}

// Mock 데이터 제거 - 팀원의 SearchRepositoryImpl 사용

// 팀원의 SearchRepositoryImpl을 사용하는 서비스 인스턴스
export const getMovieInfoService = new GetMovieInfoService();
