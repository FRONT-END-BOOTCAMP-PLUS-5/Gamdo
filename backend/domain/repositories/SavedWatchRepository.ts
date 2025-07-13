export interface SavedWatchRepository {
  getWatchedMovies(params: { userId?: string; movieId?: string; isRecommended?: boolean }): Promise<{ movie_id: string; is_recommended: boolean }[]>;
  addMovieWatch(user_id: string, movie_id: string, is_recommended: boolean): Promise<void>;
} 