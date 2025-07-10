export interface MovieLikeRepository {
  getLikedMoviesByUser(userId: string): Promise<{ movie_id: string; is_recommended: boolean }[]>;
  addMovieLike(user_id: string, movie_id: string, is_recommended: boolean): Promise<void>;
} 