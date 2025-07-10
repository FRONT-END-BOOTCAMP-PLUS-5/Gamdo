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

  static async searchMulti(query: string, page: number = 1) {
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
    // SearchResult 타입에 맞게 변환
    const mappedResults = response.data.results
      .map((item: any) => {
        if (item.media_type === "movie" || item.media_type === "tv") {
          return {
            id: item.id,
            media_type: item.media_type,
            title: item.title,
            overview: item.overview,
            poster_path: item.poster_path,
            backdrop_path: item.backdrop_path,
            release_date: item.release_date,
            genre_ids: item.genre_ids,
          };
        } else if (item.media_type === "person") {
          return {
            id: item.id,
            media_type: item.media_type,
            name: item.name,
            profile_path: item.profile_path,
            known_for: (item.known_for || []).map((kf: any) => ({
              id: kf.id,
              media_type: kf.media_type,
              title: kf.title,
              overview: kf.overview,
              poster_path: kf.poster_path,
              backdrop_path: kf.backdrop_path,
              release_date: kf.release_date,
              genre_ids: kf.genre_ids,
            })),
          };
        }
        return undefined;
      })
      .filter(Boolean);
    return {
      page: response.data.page,
      results: mappedResults,
      total_pages: response.data.total_pages,
      total_results: response.data.total_results,
    };
  }
}
