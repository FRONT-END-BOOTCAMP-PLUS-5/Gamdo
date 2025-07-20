import { CertificationDto } from "@/backend/application/movies/dtos/MovieDetailDto";
import axios from "axios";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

if (!TMDB_API_KEY) {
  throw new Error("TMDB_API_KEY is not defined in environment variables");
}

// TMDB 이미지 URL 유틸리티
export class TmdbImageUtils {
  static getImageUrl(path: string | null, size: string = "w342"): string {
    if (!path) return "/assets/images/test_image_01.png";
    return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
  }

  static getPosterUrl(path: string | null, size: string = "w342"): string {
    return this.getImageUrl(path, size);
  }

  static getProfileUrl(path: string | null, size: string = "w185"): string {
    return this.getImageUrl(path, size);
  }

  static getBackdropUrl(path: string | null, size: string = "w780"): string {
    return this.getImageUrl(path, size);
  }
}

export class TmdbApi {
  static async getMovieDetails(movieId: string): Promise<unknown> {
    const url = `${TMDB_BASE_URL}/movie/${movieId}`;
    const response = await axios.get(url, {
      params: {
        api_key: TMDB_API_KEY,
        language: "ko-KR",
      },
    });
    return response.data;
  }

  static async getMovieCredits(movieId: string): Promise<unknown> {
    const url = `${TMDB_BASE_URL}/movie/${movieId}/credits`;
    const response = await axios.get(url, {
      params: {
        api_key: TMDB_API_KEY,
        language: "ko-KR",
      },
    });
    return response.data;
  }

  static async getPersonCredits(personId: string): Promise<unknown> {
    const url = `${TMDB_BASE_URL}/person/${personId}/combined_credits`;
    const response = await axios.get(url, {
      params: {
        api_key: TMDB_API_KEY,
        language: "ko-KR",
      },
    });
    return response.data;
  }

  static async getMovieWatchProviders(movieId: string): Promise<unknown> {
    const url = `${TMDB_BASE_URL}/movie/${movieId}/watch/providers`;
    const response = await axios.get(url, {
      params: {
        api_key: TMDB_API_KEY,
      },
    });
    return response.data;
  }

  static async getMovieReleaseDates(movieId: string): Promise<unknown> {
    const url = `${TMDB_BASE_URL}/movie/${movieId}/release_dates`;
    const response = await axios.get(url, {
      params: {
        api_key: TMDB_API_KEY,
      },
    });
    return response.data;
  }

  static async searchMulti(
    query: string,
    page: number = 1,
    language: string = "ko-KR"
  ): Promise<CertificationDto> {
    const url = `${TMDB_BASE_URL}/search/multi`;
    const response = await axios.get(url, {
      params: {
        api_key: TMDB_API_KEY,
        language,
        query,
        page,
        include_adult: false,
      },
    });
    return response.data;
  }

  static async getTrendingMovies(page: number = 1): Promise<unknown> {
    const url = `${TMDB_BASE_URL}/trending/movie/week`;
    const response = await axios.get(url, {
      params: {
        api_key: TMDB_API_KEY,
        language: "ko-KR", // 한국어로 영화 정보 가져오기
        page,
      },
    });
    return response.data;
  }
}
