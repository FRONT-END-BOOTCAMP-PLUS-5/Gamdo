export async function fetchFromTMDB(endpoint: string, params: Record<string, string | number> = {}) {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    throw new Error('TMDB_API_KEY 환경변수가 설정되어 있지 않습니다.');
  }

  // endpoint 앞뒤 / 처리
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = new URL(`https://api.themoviedb.org/3${cleanEndpoint}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
  url.searchParams.set('api_key', apiKey);

  const res = await fetch(url.toString(), { next: { revalidate: 60 } }); // Next.js 캐싱 예시
  if (!res.ok) {
    throw new Error(`TMDB API 요청 실패: ${res.status} ${res.statusText}`);
  }
  return res.json();
} 