"use client";
import { useEffect, useState } from "react";
import { PosterCard } from "@/app/components";
import MovieDetailModal from "../../movie-detail/components/MovieDetailModal";

// 트렌딩 영화 타입 정의
interface TrendingMovie {
  id: number;
  title: string;
  poster_path?: string;
  backdrop_path?: string;
  release_date?: string;
  vote_average?: number;
}

interface TrendingResponse {
  page: number;
  results: TrendingMovie[];
  total_pages: number;
  total_results: number;
}

export default function RecommendedMovieList() {
  const [trendingMovies, setTrendingMovies] = useState<TrendingMovie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMovieDetailModal, setShowMovieDetailModal] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);

  // 트렌딩 영화 가져오기
  const fetchTrendingMovies = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/search/trending?page=1");

      if (!response.ok) {
        throw new Error("트렌딩 영화를 불러올 수 없습니다.");
      }

      const data: TrendingResponse = await response.json();

      // 전체 데이터에서 랜덤으로 8개 선택
      const shuffledMovies = data.results.sort(() => Math.random() - 0.5);
      const limitedMovies = shuffledMovies.slice(0, 8);
      setTrendingMovies(limitedMovies);
    } catch (err) {
      console.error("트렌딩 영화 조회 에러:", err);
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      );
      setTrendingMovies([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 영화 포스터 클릭 핸들러
  const handleMovieClick = (movieTitle: string) => {
    // Backend 검색 API를 사용하여 영화 ID 찾기
    fetch(`/api/movies/search?query=${encodeURIComponent(movieTitle)}&page=1`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`검색 요청 실패: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // 검색 결과에서 영화만 필터링
        const movie = data.results?.find(
          (item: { media_type: string; id: number }) =>
            item.media_type === "movie"
        );

        if (movie && movie.id) {
          console.log(`영화 "${movieTitle}" ID 찾음:`, movie.id);
          setSelectedMovieId(movie.id);
          setShowMovieDetailModal(true);
        } else {
          console.warn(`영화 "${movieTitle}" 검색 결과 없음`);
          alert(`"${movieTitle}" 영화 정보를 찾을 수 없습니다.`);
        }
      })
      .catch((error) => {
        console.error("영화 검색 중 오류:", error);
        alert("영화 정보를 불러올 수 없습니다. 잠시 후 다시 시도해주세요.");
      });
  };

  // 컴포넌트 마운트 시 트렌딩 영화 가져오기
  useEffect(() => {
    fetchTrendingMovies();
  }, []);

  return (
    <section className="w-full mx-auto mt-4">
      <h3 className="text-xl font-bold mb-6">요즘 뜨고 있는 콘텐츠</h3>

      {/* 로딩 상태 */}
      {isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="aspect-[308/457] bg-slate-800 rounded-[20px] animate-pulse"
            />
          ))}
        </div>
      )}

      {/* 에러 상태 */}
      {error && (
        <div className="text-center text-gray-400">
          <p>트렌딩 영화를 불러올 수 없습니다.</p>
          <p className="text-sm mt-2">{error}</p>
        </div>
      )}

      {/* 트렌딩 영화 표시 */}
      {!isLoading && !error && trendingMovies.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
          {trendingMovies.map((movie) => {
            const imageUrl = movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : "/assets/images/no_poster_image.png";

            return (
              <div
                key={movie.id}
                onClick={() => handleMovieClick(movie.title)}
                className="cursor-pointer"
              >
                <PosterCard imageUrl={imageUrl} name={movie.title} />
              </div>
            );
          })}
        </div>
      )}

      {/* 영화 상세 모달 */}
      {showMovieDetailModal && selectedMovieId && (
        <MovieDetailModal
          movieId={selectedMovieId}
          setModal={() => setShowMovieDetailModal(false)}
        />
      )}
    </section>
  );
}
