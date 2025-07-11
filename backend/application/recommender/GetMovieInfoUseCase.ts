import { MovieRepository } from "../../domain/repositories/recommender/movie";
import {
  MovieInfo,
  MovieSearchRequest,
  RecommendedMovie,
  MoviePosterRequest,
  MovieDetailRequest,
} from "../../domain/entities/recommender/movie";

// 영화 정보 처리 서비스 클래스
export class GetMovieInfoService {
  private movieRepository: MovieRepository;

  constructor(movieRepository: MovieRepository) {
    this.movieRepository = movieRepository;
  }

  /**
   * 영화 제목으로 검색하여 첫 번째 결과를 반환합니다
   * @param title 영화 제목
   * @param language 언어 (기본값: 'ko-KR')
   * @returns 영화 정보 또는 null
   */
  async searchMovieByTitle(
    title: string,
    language: string = "ko-KR"
  ): Promise<MovieInfo | null> {
    try {
      const request: MovieSearchRequest = {
        query: title,
        language,
        page: 1,
        includeAdult: false,
      };

      const response = await this.movieRepository.searchMovies(request);

      if (
        response.success &&
        response.data &&
        response.data.results.length > 0
      ) {
        // 첫 번째 검색 결과를 반환
        return response.data.results[0];
      }

      return null;
    } catch (error) {
      console.error(`영화 검색 중 오류 (${title}):`, error);
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

      const request: MoviePosterRequest = {
        posterPath,
        size,
      };

      const response = await this.movieRepository.getMoviePosterUrl(request);

      if (response.success && response.data) {
        return response.data.posterUrl;
      }

      return null;
    } catch (error) {
      console.error("포스터 URL 생성 중 오류:", error);
      return null;
    }
  }

  /**
   * AI 추천 영화 제목들을 받아서 영화 정보와 포스터를 가져옵니다
   * @param movieTitles 영화 제목 배열
   * @param language 언어 (기본값: 'ko-KR')
   * @returns 추천 영화 정보 배열
   */
  async getRecommendedMoviesInfo(
    movieTitles: string[],
    language: string = "ko-KR"
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

        // 영화 정보 검색
        const movieInfo = await this.searchMovieByTitle(movie.title, language);

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
   * @param language 언어 (기본값: 'ko-KR')
   * @returns 추천 영화 정보
   */
  async getSingleMovieInfo(
    title: string,
    language: string = "ko-KR"
  ): Promise<RecommendedMovie> {
    const recommendedMovie: RecommendedMovie = {
      title,
      searchStatus: "searching",
    };

    try {
      // 영화 정보 검색
      const movieInfo = await this.searchMovieByTitle(title, language);

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
   * 영화 제목을 정규화합니다 (검색 정확도 향상)
   * @param title 원본 영화 제목
   * @returns 정규화된 영화 제목
   */
  normalizeMovieTitle(title: string): string {
    return title
      .replace(/["""'']/g, "") // 따옴표 제거
      .replace(/\s+/g, " ") // 연속된 공백을 하나로
      .replace(/^\d+\.\s*/, "") // 앞의 번호 제거
      .replace(/^-\s*/, "") // 앞의 대시 제거
      .trim();
  }
}

// 임시 Mock Repository (실제 구현체 연동 전까지 사용)
export class MockMovieRepository implements MovieRepository {
  // Mock 영화 데이터 (유명한 영화들)
  private mockMovies: MovieInfo[] = [
    {
      id: 1,
      title: "아바타",
      originalTitle: "Avatar",
      overview: "판도라 행성에서 벌어지는 인간과 나비족의 이야기",
      releaseDate: "2009-12-18",
      posterPath: "/6EiRUJpuoeQPghrs3YNktfnqOVh.jpg",
      backdropPath: "/vL5LR6WdxWPjLPFRLe133jXWsh5.jpg",
      voteAverage: 7.6,
      voteCount: 27000,
      popularity: 2000.5,
      adult: false,
      genreIds: [28, 12, 878],
      originalLanguage: "en",
    },
    {
      id: 2,
      title: "어벤져스: 엔드게임",
      originalTitle: "Avengers: Endgame",
      overview: "타노스와의 최후의 전투",
      releaseDate: "2019-04-26",
      posterPath: "/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
      backdropPath: "/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg",
      voteAverage: 8.3,
      voteCount: 22000,
      popularity: 1800.2,
      adult: false,
      genreIds: [12, 878, 28],
      originalLanguage: "en",
    },
    {
      id: 3,
      title: "기생충",
      originalTitle: "Parasite",
      overview: "반지하 가족의 기택네와 고대 가족의 만남",
      releaseDate: "2019-05-30",
      posterPath: "/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
      backdropPath: "/TU9NIjwzjoKPwQHoHshkBcQZzr.jpg",
      voteAverage: 8.5,
      voteCount: 15000,
      popularity: 1200.8,
      adult: false,
      genreIds: [35, 53, 18],
      originalLanguage: "ko",
    },
    {
      id: 4,
      title: "인터스텔라",
      originalTitle: "Interstellar",
      overview: "지구를 구하기 위한 우주 여행",
      releaseDate: "2014-11-07",
      posterPath: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
      backdropPath: "/xu9zaAevzQ5nnrsXN6JcahLnG4i.jpg",
      voteAverage: 8.6,
      voteCount: 32000,
      popularity: 2200.1,
      adult: false,
      genreIds: [878, 18, 12],
      originalLanguage: "en",
    },
    {
      id: 5,
      title: "겨울왕국",
      originalTitle: "Frozen",
      overview: "엘사와 안나 자매의 이야기",
      releaseDate: "2013-11-27",
      posterPath: "/kgwjIb2JDHRhNk13lmSxiClFjVk.jpg",
      backdropPath: "/8vWBbWb5WinCDYjFpVbNL6hqRYn.jpg",
      voteAverage: 7.3,
      voteCount: 18000,
      popularity: 1500.7,
      adult: false,
      genreIds: [16, 35, 10751],
      originalLanguage: "en",
    },
    {
      id: 6,
      title: "극한직업",
      originalTitle: "Extreme Job",
      overview: "마약수사대의 치킨집 잠복수사",
      releaseDate: "2019-01-23",
      posterPath: "/6z2-mYGZr5kBuOOK3fvNXXcxNZY.jpg",
      backdropPath: "/k8iK5YOlTnKNBRKQKKMeL5LXlCY.jpg",
      voteAverage: 7.8,
      voteCount: 520,
      popularity: 890.5,
      adult: false,
      genreIds: [35, 80, 28],
      originalLanguage: "ko",
    },
    {
      id: 7,
      title: "타이타닉",
      originalTitle: "Titanic",
      overview: "타이타닉호 침몰과 로맨스",
      releaseDate: "1997-12-19",
      posterPath: "/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg",
      backdropPath: "/nzJgmPGhqcqZOdLzpGjhAoJEJCN.jpg",
      voteAverage: 7.9,
      voteCount: 24000,
      popularity: 1900.3,
      adult: false,
      genreIds: [18, 10749],
      originalLanguage: "en",
    },
    {
      id: 8,
      title: "스파이더맨: 노 웨이 홈",
      originalTitle: "Spider-Man: No Way Home",
      overview: "스파이더맨 멀티버스",
      releaseDate: "2021-12-17",
      posterPath: "/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
      backdropPath: "/iQFcwSGbZXMkeyKrxbPnwnRo5fl.jpg",
      voteAverage: 8.1,
      voteCount: 19000,
      popularity: 2500.0,
      adult: false,
      genreIds: [28, 12, 878],
      originalLanguage: "en",
    },
    {
      id: 9,
      title: "신과함께-죄와 벌",
      originalTitle: "Along with the Gods: The Two Worlds",
      overview: "사후세계 재판 이야기",
      releaseDate: "2017-12-20",
      posterPath: "/5tgVhPJf55tKAo2FRyaIAXWOPO.jpg",
      backdropPath: "/mNhSl8rSQcDEzlKlQsNnXSPGHNJ.jpg",
      voteAverage: 8.2,
      voteCount: 2100,
      popularity: 750.4,
      adult: false,
      genreIds: [14, 18, 28],
      originalLanguage: "ko",
    },
    {
      id: 10,
      title: "베놈",
      originalTitle: "Venom",
      overview: "에디 브록과 심비오트의 만남",
      releaseDate: "2018-10-03",
      posterPath: "/2uNW4WbgBXL25BAbXGLnLqX71Sw.jpg",
      backdropPath: "/VuukZLgaCrho2Ar8Scl9HtV3yD.jpg",
      voteAverage: 6.7,
      voteCount: 15000,
      popularity: 1300.6,
      adult: false,
      genreIds: [878, 28],
      originalLanguage: "en",
    },
  ];

  async searchMovies(request: MovieSearchRequest) {
    try {
      console.log("Mock: 영화 검색 요청:", request.query);

      // 영화 제목으로 검색 (부분 일치)
      const searchResults = this.mockMovies.filter(
        (movie) =>
          movie.title.toLowerCase().includes(request.query.toLowerCase()) ||
          movie.originalTitle
            .toLowerCase()
            .includes(request.query.toLowerCase())
      );

      return {
        success: true,
        data: {
          page: 1,
          results: searchResults,
          totalPages: 1,
          totalResults: searchResults.length,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: "Mock 검색 중 오류가 발생했습니다.",
      };
    }
  }

  async getMovieDetails(_request: MovieDetailRequest) {
    return {
      success: false,
      error: "Mock에서는 상세 정보를 지원하지 않습니다.",
    };
  }

  async getMoviePosterUrl(request: MoviePosterRequest) {
    try {
      if (!request.posterPath) {
        return {
          success: false,
          error: "포스터 경로가 없습니다.",
        };
      }

      // TMDB 이미지 URL 형식으로 생성
      const baseUrl = "https://image.tmdb.org/t/p/";
      const size = request.size || "w500";
      const posterUrl = `${baseUrl}${size}${request.posterPath}`;

      return {
        success: true,
        data: {
          posterUrl,
          originalUrl: `${baseUrl}original${request.posterPath}`,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: "Mock 포스터 URL 생성 중 오류가 발생했습니다.",
      };
    }
  }

  async getImageConfiguration() {
    return {
      success: true,
      data: {
        baseUrl: "https://image.tmdb.org/t/p/",
        secureBaseUrl: "https://image.tmdb.org/t/p/",
        backdropSizes: ["w300", "w780", "w1280", "original"],
        logoSizes: ["w45", "w92", "w154", "w185", "w300", "w500", "original"],
        posterSizes: [
          "w92",
          "w154",
          "w185",
          "w342",
          "w500",
          "w780",
          "original",
        ],
        profileSizes: ["w45", "w185", "h632", "original"],
        stillSizes: ["w92", "w185", "w300", "original"],
      },
    };
  }
}

// 임시 서비스 인스턴스 (실제 구현체 연동 전까지 사용)
export const getMovieInfoService = new GetMovieInfoService(
  new MockMovieRepository()
);
