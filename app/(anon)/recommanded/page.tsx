'use client';

import { useEffect, useState } from 'react';
import { moviesMockData } from './moviesMockData';

interface Movie {
  id: number;
  title: string;
  is_recommended: boolean;
  [key: string]: any;
}

export default function RecommandedPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  // 북마크(추천) 목데이터 추가 함수
  const addBookmark = async () => {
    await fetch(' /api/anon/movie-like', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: '1bab7279-6c9e-4a86-ab40-56b3de0a25b8',
        movie_id: '299534', // 예시: 어벤져스 엔드게임
        is_recommended: true,
      }),
    });
    // 추가 후 목록 새로고침
    fetchMovies();
  };

  const fetchMovies = () => {
    setLoading(true);
    fetch('/api/movie-like?user_id=1bab7279-6c9e-4a86-ab40-56b3de0a25b8')
      .then((res) => res.json())
      .then((data) => {
        setMovies(data.movies || []);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  if (loading) return <div>로딩 중...</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">추천 영화 목록</h1>
      <button
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={addBookmark}
      >
        북마크(추천) 목데이터 추가
      </button>
      <ul>
        {movies.map((movie, idx) => (
          <li key={movie.id ?? movie.movie_id ?? idx} className="mb-2">
            <span className="font-semibold">{movie.title}</span>
            {movie.is_recommended && (
              <span className="ml-2 text-green-600 font-bold">★ 추천</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
} 