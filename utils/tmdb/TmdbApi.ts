import { CertificationDto } from "@/backend/application/movies/dtos/MovieDetailDto";
import axios from "axios";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

if (!TMDB_API_KEY) {
  throw new Error("TMDB_API_KEY is not defined in environment variables");
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
    page: number = 1
  ): Promise<CertificationDto> {
    const url = `${TMDB_BASE_URL}/search/multi`;
    const response = await axios.get(url, {
      params: {
        api_key: TMDB_API_KEY,
        language: "ko-KR",
        query,
        page,
        include_adult: false,
      },
    });
    return response.data;
  }
}
