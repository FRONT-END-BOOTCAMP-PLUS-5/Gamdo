import axios from "axios";
import { MoviePosterRepository } from "../../domain/repositories/saves/MoviePosterRepository";
import {
  MoviePoster,
  MoviePosterResult,
} from "../../domain/entities/saves/MoviePoster";

/**
 * 영화 포스터 리포지토리 구현체
 */
export class MoviePosterRepositoryImpl implements MoviePosterRepository {
  private readonly TMDB_API_KEY = process.env.TMDB_API_KEY;
  private readonly TMDB_BASE_URL = "https://api.themoviedb.org/3";

  /**
   * 영화 ID로 TMDB API에서 포스터 정보 조회
   */
  async getMoviePosterById(movieId: string): Promise<MoviePosterResult> {
    try {
      if (!movieId) {
        return {
          success: false,
          error: "영화 ID가 필요합니다.",
        };
      }

      if (!this.TMDB_API_KEY) {
        return {
          success: false,
          error: "TMDB API 키가 설정되지 않았습니다.",
        };
      }

      // TMDB API 호출
      const url = `${this.TMDB_BASE_URL}/movie/${movieId}`;
      const response = await axios.get(url, {
        params: {
          api_key: this.TMDB_API_KEY,
          language: "ko-KR",
        },
      });

      const { id, title, poster_path, backdrop_path, overview, release_date } =
        response.data;

      // 포스터 URL 생성
      const posterUrl = poster_path
        ? `https://image.tmdb.org/t/p/w500${poster_path}`
        : null;

      const backdropUrl = backdrop_path
        ? `https://image.tmdb.org/t/p/w1280${backdrop_path}`
        : null;

      // 영화 포스터 엔티티 생성
      const moviePoster: MoviePoster = {
        id,
        title,
        posterPath: poster_path,
        backdropPath: backdrop_path,
        posterUrl,
        backdropUrl,
        overview,
        releaseDate: release_date,
      };

      return {
        success: true,
        moviePoster,
      };
    } catch (error: unknown) {
      // TMDB API 오류 처리
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response: { status: number; statusText: string };
        };
        const status = axiosError.response.status;

        if (status === 404) {
          return {
            success: false,
            error: `영화 ID ${movieId}를 찾을 수 없습니다.`,
          };
        }

        if (status === 401) {
          return {
            success: false,
            error: "TMDB API 키가 유효하지 않습니다.",
          };
        }

        return {
          success: false,
          error: `TMDB API 오류: ${status} ${axiosError.response.statusText}`,
        };
      }

      return {
        success: false,
        error: "영화 포스터 정보를 가져오는 중 오류가 발생했습니다.",
      };
    }
  }
}
