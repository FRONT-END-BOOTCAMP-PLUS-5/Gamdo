import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.TMDB_API_KEY;
const BASE = 'https://api.themoviedb.org/3';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const movieId = searchParams.get('movieId');
  if (!movieId) {
    return NextResponse.json({ error: 'movieId 파라미터가 필요합니다.' }, { status: 400 });
  }
  const url = `${BASE}/movie/${movieId}/recommendations?api_key=${API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  return NextResponse.json(data);
} 