import { createClient } from '@supabase/supabase-js';
import { SavedWatchRepository } from '../../domain/repositories/SavedWatchRepository';

// 백엔드용 Supabase 클라이언트 생성
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);


// user_id: uuid, movie_id: string(varchar), is_recommended: boolean
// 예시: user_id = 'b3e1c2d4-5f6a-7b8c-9d0e-1f2a3b4c5d6e', movie_id = '155', is_recommended = true

export class SbSavedWatchRepository implements SavedWatchRepository {
  async getWatchedMovies({
    userId,
    movieId,
    isRecommended,
  }: {
    userId?: string;
    movieId?: string;
    isRecommended?: boolean;
  }): Promise<{ movie_id: string; is_recommended: boolean }[]> {
    let query = supabase
      .from('saved_watch')
      .select('movie_id, is_recommended');

    if (userId) query = query.eq('user_id', userId);
    if (movieId) query = query.eq('movie_id', movieId);
    if (isRecommended !== undefined) query = query.eq('is_recommended', isRecommended);

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return (data || []) as { movie_id: string; is_recommended: boolean }[];
  }

  async addMovieWatch(
    user_id: string, // uuid
    movie_id: string, // varchar
    is_recommended: boolean // boolean
  ) {
    // 예시: user_id = 'b3e1c2d4-5f6a-7b8c-9d0e-1f2a3b4c5d6e', movie_id = '155', is_recommended = true
    const { error } = await supabase.from('saved_watch').insert([
      {
        user_id,
        movie_id,
        is_recommended,
      },
    ]);
    if (error) throw new Error(error.message);
  }
}
 