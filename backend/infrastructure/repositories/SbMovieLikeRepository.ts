import { supabase } from '../../../utils/supabase/client';
import { MovieLikeRepository } from '../../domain/repositories/MovieLikeRepository';

export class SbMovieLikeRepository implements MovieLikeRepository {
  async getLikedMoviesByUser(userId: string) {
    const { data, error } = await supabase
      .from('test_kang')
      .select('movie_id, is_recommended')
      .eq('user_id', userId);
    if (error) throw new Error(error.message);
    return data || [];
  }

  async addMovieLike(user_id: string, movie_id: string, is_recommended: boolean) {
    const { error } = await supabase
      .from('test_kang')
      .insert([{ user_id, movie_id, is_recommended }]);
    if (error) throw new Error(error.message);
  }
} 