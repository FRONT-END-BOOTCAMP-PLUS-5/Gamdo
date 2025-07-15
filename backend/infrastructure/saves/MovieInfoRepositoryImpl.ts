import axios from "axios";
import { MovieInfoRepository } from "../../domain/repositories/saves/MovieInfoRepository";
import {
  MovieInfo,
  MovieInfoResult,
} from "../../domain/entities/saves/MovieInfo";

/**
 * 영화 정보 리포지토리 구현체
 */
export class MovieInfoRepositoryImpl implements MovieInfoRepository {
  private readonly TMDB_API_KEY = process.env.TMDB_API_KEY;
  private readonly TMDB_BASE_URL = "https://api.themoviedb.org/3";

  /**
   * 영화 ID로 TMDB API에서 영화 정보 조회
   */
  async getMovieInfoById(movieId: string): Promise<MovieInfoResult> {
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

      const { id, title, overview, release_date } = response.data;

      // 영화 정보 엔티티 생성
      const movieInfo: MovieInfo = {
        id,
        title,
        overview,
        releaseDate: release_date,
      };

      return {
        success: true,
        movieInfo,
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
        error: "영화 정보를 가져오는 중 오류가 발생했습니다.",
      };
    }
  }
}
