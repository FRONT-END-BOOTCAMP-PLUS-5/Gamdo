import { NextRequest, NextResponse } from 'next/server';
import { getMovieList } from '@/core/tmdb/application/getMovieList';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const listType = searchParams.get('type') || 'popular';
  const page = Number(searchParams.get('page') || 1);

  try {
    const data = await getMovieList(listType, page);
    const results = (data.results || []).map((movie: any) => ({
      ...movie,
      poster_url: movie.poster_path
        ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
        : null,
    }));
    return NextResponse.json({ ...data, results });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
} 