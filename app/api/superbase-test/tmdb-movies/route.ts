import { NextRequest, NextResponse } from 'next/server';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BEARER_TOKEN = process.env.TMDB_BEARER_TOKEN;

// 타입 정의
interface Keyword {
  id: number;
  name: string;
}
interface MovieKeywords {
  id: number;
  keywords: Keyword[];
}

interface ListResult {
  id: number;
  page: number;
  results: any[];
  total_pages: number;
  total_results: number;
}

interface ImageInfo {
  aspect_ratio: number;
  height: number;
  iso_639_1: string | null;
  file_path: string;
  vote_average: number;
  vote_count: number;
  width: number;
}
interface MovieImages {
  backdrops: ImageInfo[];
  id: number;
  logos: any[];
  posters: ImageInfo[];
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const movieId = searchParams.get('movieId') ?? '55555';
  const listId = searchParams.get('listId') ?? '7107644';

  const headers: HeadersInit = TMDB_BEARER_TOKEN
    ? {
        accept: 'application/json',
        Authorization: `Bearer ${TMDB_BEARER_TOKEN}`,
      }
    : { accept: 'application/json' };


  const keywordsUrl = TMDB_BEARER_TOKEN
    ? `https://api.themoviedb.org/3/movie/${movieId}/keywords`
    : `https://api.themoviedb.org/3/movie/${movieId}/keywords?api_key=${TMDB_API_KEY}`;
  const listsUrl = TMDB_BEARER_TOKEN
    ? `https://api.themoviedb.org/3/list/${listId}`
    : `https://api.themoviedb.org/3/list/${listId}?api_key=${TMDB_API_KEY}`;
  const imagesUrl = TMDB_BEARER_TOKEN
    ? `https://api.themoviedb.org/3/movie/${movieId}/images`
    : `https://api.themoviedb.org/3/movie/${movieId}/images?api_key=${TMDB_API_KEY}`;

  const [keywordsRes, listsRes, imagesRes] = await Promise.all([
    fetch(keywordsUrl, { headers }),
    fetch(listsUrl, { headers }),
    fetch(imagesUrl, { headers })
  ]);

  if (!keywordsRes.ok || !listsRes.ok || !imagesRes.ok) {
    return NextResponse.json({
      error: 'TMDB API 요청 실패',
      keywordsStatus: keywordsRes.status,
      listsStatus: listsRes.status,
      imagesStatus: imagesRes.status
    }, { status: 500 });
  }

  const keywords: MovieKeywords = await keywordsRes.json();
  const lists: ListResult = await listsRes.json();
  const images: MovieImages = await imagesRes.json();

  return NextResponse.json({
    keywords,
    lists,
    images
  });
}