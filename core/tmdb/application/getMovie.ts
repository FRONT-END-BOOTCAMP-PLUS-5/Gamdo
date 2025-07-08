import { fetchFromTMDB } from '../infrastructure/tmdbApi';

export async function getMovie(query: string) {
  return fetchFromTMDB('search/movie', { query });
} 