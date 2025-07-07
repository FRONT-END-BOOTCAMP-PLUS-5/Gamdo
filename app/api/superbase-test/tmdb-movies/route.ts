import { NextResponse } from 'next/server';

const TMDB_API_KEY = process.env.TMDB_API_KEY;

// 제목으로 영화 검색
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query'); // 검색어(제목)
  const director = searchParams.get('director'); // 감독(선택)

  if (!query && !director) {
    return NextResponse.json({ error: 'query 또는 director 파라미터가 필요합니다.' }, { status: 400 });
  }

  // 1. 제목으로 영화 검색
  let movies: any[] = [];
  if (query) {
    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&language=ko-KR&query=${encodeURIComponent(query)}`
    );
    const data = await res.json();
    movies = data.results || [];
  }

  // 2. 감독으로 검색 시: 인물 검색 → 해당 인물이 감독한 영화만 필터링
  if (director) {
    // 2-1. 감독 이름으로 인물 검색
    const personRes = await fetch(
      `https://api.themoviedb.org/3/search/person?api_key=${TMDB_API_KEY}&language=ko-KR&query=${encodeURIComponent(director)}`
    );
    const personData = await personRes.json();
    const directorPerson = (personData.results || []).find((p: any) =>
      (p.known_for_department === 'Directing')
    );
    if (!directorPerson) {
      return NextResponse.json({ error: '해당 감독을 찾을 수 없습니다.' }, { status: 404 });
    }

    // 2-2. 감독이 참여한 영화 목록 조회
    const creditsRes = await fetch(
      `https://api.themoviedb.org/3/person/${directorPerson.id}/movie_credits?api_key=${TMDB_API_KEY}&language=ko-KR`
    );
    const creditsData = await creditsRes.json();
    const directedMovies = (creditsData.crew || []).filter((c: any) => c.job === 'Director');

    // 제목+감독 동시 검색 시 교집합 반환
    if (query) {
      const directedMovieIds = new Set(directedMovies.map((m: any) => m.id));
      movies = movies.filter((m: any) => directedMovieIds.has(m.id));
    } else {
      movies = directedMovies;
    }
  }

  return NextResponse.json(movies);
}