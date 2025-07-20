import React, { useEffect, useState } from "react";
import { CircleCard, PosterCard } from "@/app/components";
import { useSearchParams, useRouter } from "next/navigation";
import MovieDetailModal from "../../movie-detail/components/MovieDetailModal";

interface SearchResultProps {
  type: string;
  onTypeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

// 검색 결과 타입 정의
interface SearchResult {
  id: number;
  media_type: "movie" | "tv" | "person";
  title?: string;
  name?: string;
  overview: string;
  poster_path?: string;
  profile_path?: string;
  backdrop_path?: string;
  release_date?: string;
  genre_ids?: number[];
  known_for?: SearchResult[];
}

interface SearchResponse {
  page: number;
  results: SearchResult[];
  total_pages: number;
  total_results: number;
}

export default function SearchResult({
  type,
  onTypeChange,
}: SearchResultProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMovieDetailModal, setShowMovieDetailModal] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);

  const keywordFromQuery = searchParams.get("keyword") || "";

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

  // 배우/감독 클릭 핸들러
  const handlePersonClick = (personName: string) => {
    router.push(`/search/artist?name=${encodeURIComponent(personName)}`);
  };

  // 검색 실행 함수
  const performSearch = async (searchKeyword: string, searchType: string) => {
    if (!searchKeyword.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/movies/search?query=${encodeURIComponent(searchKeyword)}`
      );

      if (!response.ok) {
        throw new Error("검색 중 오류가 발생했습니다.");
      }

      const data: SearchResponse = await response.json();

      // type 필터링 및 이미지 필터링
      let filteredResults = data.results;

      // 이미지가 없는 항목 제거
      filteredResults = filteredResults.filter((result) => {
        if (result.media_type === "person") {
          // 배우/감독은 profile_path가 있어야 함
          return result.profile_path;
        } else {
          // 영화/TV는 poster_path가 있어야 함
          return result.poster_path;
        }
      });

      // type 필터링 (all이 아닌 경우)
      if (searchType !== "all") {
        filteredResults = filteredResults.filter((result) => {
          if (searchType === "movie" && result.media_type === "movie")
            return true;
          if (searchType === "tv" && result.media_type === "tv") return true;
          if (searchType === "person" && result.media_type === "person")
            return true;
          return false;
        });
      }

      setSearchResults(filteredResults);
    } catch (err) {
      console.error("검색 에러:", err);
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      );
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // keyword나 type이 변경될 때마다 검색 실행
  useEffect(() => {
    performSearch(keywordFromQuery, type);
  }, [keywordFromQuery, type]);

  return (
    <div className="w-full mx-auto mt-4">
      <h3 className="text-xl font-light mb-6">
        <span className="font-bold">&ldquo;{keywordFromQuery}&rdquo;</span>의
        관련 콘텐츠
        <span className="font-bold">{searchResults.length}개</span>가 검색
        되었어요.
      </h3>
      <div className="flex items-center gap-4 mb-8 justify-end">
        <select
          id="type"
          value={type}
          onChange={onTypeChange}
          className="max-w-[200px] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        >
          <option value="all">전체</option>
          <option value="movie">영화</option>
          <option value="tv">TV</option>
          <option value="person">인물</option>
        </select>
      </div>

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
          <p>검색 중 오류가 발생했습니다.</p>
          <p className="text-sm mt-2">{error}</p>
        </div>
      )}

      {/* 검색 결과가 없는 경우 */}
      {!isLoading &&
        !error &&
        searchResults.length === 0 &&
        keywordFromQuery && (
          <div className="text-center text-gray-400">
            <p>&ldquo;{keywordFromQuery}&rdquo;에 대한 검색 결과가 없습니다.</p>
            <p className="text-sm mt-2">다른 검색어를 시도해보세요.</p>
          </div>
        )}

      {/* 검색 결과 표시 */}
      {!isLoading && !error && searchResults.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
          {searchResults.map((result) => {
            // 배우/감독인 경우 CircleCard 사용 (프로필 이미지가 있는 경우만)
            if (result.media_type === "person" && result.profile_path) {
              const imageUrl = `https://image.tmdb.org/t/p/w185${result.profile_path}`;

              // 한글 이름 우선 사용 (TMDB에서 한국어로 검색했으므로 name이 한글일 가능성이 높음)
              const displayName = result.name || "이름 없음";

              return (
                <div
                  key={result.id}
                  onClick={() => handlePersonClick(displayName)}
                  className="cursor-pointer"
                >
                  <CircleCard imageUrl={imageUrl} name={displayName} />
                </div>
              );
            }

            // 영화/TV인 경우 PosterCard 사용
            const title = result.title || result.name || "제목 없음";
            const imageUrl = result.poster_path
              ? `https://image.tmdb.org/t/p/w500${result.poster_path}`
              : "/assets/images/no_poster_image.png";

            return (
              <div
                key={result.id}
                onClick={() => handleMovieClick(title)}
                className="cursor-pointer"
              >
                <PosterCard imageUrl={imageUrl} name={title} />
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
    </div>
  );
}
