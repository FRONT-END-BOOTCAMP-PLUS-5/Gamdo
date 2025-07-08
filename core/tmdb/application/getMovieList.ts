import { fetchFromTMDB } from '../infrastructure/tmdbApi';

export async function getMovieList(listType: string = 'popular', page: number = 1) {
  // listType: 'popular', 'now_playing', 'upcoming', 'top_rated' 등 TMDB 지원 타입
  return fetchFromTMDB(`/movie/${listType}`, { page });
} 