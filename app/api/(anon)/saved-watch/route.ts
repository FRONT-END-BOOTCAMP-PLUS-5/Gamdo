import { NextRequest, NextResponse } from 'next/server';
import { SbSavedWatchRepository } from '@/backend/infrastructure/repositories/SbSavedWatchRepository';
import { supabase } from '../../../../utils/supabase/client';

const repo = new SbSavedWatchRepository();

// POST 예시: is_recommended true/false 모두 저장 가능
// {
//   "user_id": "b3e1c2d4-5f6a-7b8c-9d0e-1f2a3b4c5d6e",
//   "movie_id": "155",
//   "is_recommended": false
// }

export async function GET(req: Request) {
  // 임시로 인증 체크 비활성화 (테스트용)
  // const authHeader = req.headers.get('Authorization');
  // if (!authHeader) return NextResponse.json({ error: 'No auth header' }, { status: 401 });

  // const token = authHeader.replace('Bearer ', '');
  // const { data: { user }, error } = await supabase.auth.getUser(token);
  // if (error || !user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

  // const userId = user.id;
  
  // 테스트용 고정 user_id 사용
  const userId = 'b3e1c2d4-5f6a-7b8c-9d0e-1f2a3b4c5d6e';
  
  // 쿼리 파라미터 받기
  const { searchParams } = new URL(req.url);
  const movieId = searchParams.get('movie_id') || undefined;
  const isRecommendedParam = searchParams.get('is_recommended');
  let isRecommended: boolean | undefined = undefined;
  if (isRecommendedParam === 'true') isRecommended = true;
  if (isRecommendedParam === 'false') isRecommended = false;

  // userId는 서버에서만 사용, 응답에만 포함
  const data = await repo.getWatchedMovies({ userId, movieId, isRecommended });
  const movies = (data || []).map((item: { movie_id: string; is_recommended: boolean }) => ({
    movie_id: item.movie_id,
    is_recommended: item.is_recommended,
  }));
  return NextResponse.json({
    movies: movies,
    total_count: movies.length
  });
}

export async function POST(req: Request) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return NextResponse.json({ error: 'No auth header' }, { status: 401 });

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

  const userId = user.id;

  const { movie_id, is_recommended } = await req.json();
  if (!movie_id) return NextResponse.json({ error: 'movie_id is required' }, { status: 400 });

  await repo.addMovieWatch(userId, movie_id, is_recommended);
  return NextResponse.json({ 
    success: true, 
    message: '영화가 찜 목록에 추가되었습니다.',
    data: { movie_id, is_recommended }
  });
} 
