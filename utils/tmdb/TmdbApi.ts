import axios from "axios";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

if (!TMDB_API_KEY) {
  throw new Error("TMDB_API_KEY is not defined in environment variables");
}

export class TmdbApi {
  static async getMovieDetails(
    movieId: string
  ): Promise<{ id: number; title: string }> {
    const url = `${TMDB_BASE_URL}/movie/${movieId}`;
    const response = await axios.get(url, {
      params: {
        api_key: TMDB_API_KEY,
        language: "ko-KR",
      },
    });
    const { id, title } = response.data;
    return { id, title };
  }
}
