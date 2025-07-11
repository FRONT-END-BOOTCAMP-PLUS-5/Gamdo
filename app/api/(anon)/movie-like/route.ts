import { NextRequest, NextResponse } from 'next/server';
// import { supabase } from '../../../../utils/supabase/client';
import { SbMovieLikeRepository } from '../../../../backend/infrastructure/repositories/SbMovieLikeRepository';

const TMDB_API_KEY = process.env.TMDB_API_KEY; // 환경변수에 TMDB API KEY 저장 필요

const repo = new SbMovieLikeRepository();

export async function GET(req: Request) {
  // 1. userId를 쿼리로 받음 (예: /api/(anon)/movie-like?user_id=123)
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('user_id');
  if (!userId) {
    return NextResponse.json({ error: 'user_id is required' }, { status: 400 });
  }

  // 2. Repository를 통해 찜한 영화 목록 조회
  try {
    const data = await repo.getLikedMoviesByUser(userId);
    // 3. TMDB에서 각 영화의 상세 정보 받아오기
    const movies = await Promise.all(
      (data || []).map(async (item: { movie_id: string; is_recommended: boolean }) => {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${item.movie_id}?api_key=${TMDB_API_KEY}&language=ko-KR`
        );
        const movie = await res.json();
        return {
          ...movie,
          is_recommended: item.is_recommended,
        };
      })
    );
    // 4. 결과 반환
    return NextResponse.json({ movies });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { user_id, movie_id, is_recommended } = await req.json();
  try {
    await repo.addMovieLike(user_id, movie_id, is_recommended);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 