"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PosterCard } from "@/app/components";
import MovieDetailModal from "../../movie-detail/components/MovieDetailModal";

// 배우 출연작 타입 정의
interface CastCredit {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string;
  backdrop_path?: string;
  release_date?: string;
  character?: string;
  media_type: "movie" | "tv";
}

interface PersonCreditsResponse {
  cast: CastCredit[];
  crew: CastCredit[];
}

function ArtistPageContent() {
  const searchParams = useSearchParams();
  const [castCredits, setCastCredits] = useState<CastCredit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [personName, setPersonName] = useState<string>("");
  const [showMovieDetailModal, setShowMovieDetailModal] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);

  const nameFromQuery = searchParams.get("name") || "";

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

  // 배우 정보와 출연작 가져오기
  const fetchPersonCredits = async (personName: string) => {
    if (!personName.trim()) {
      setCastCredits([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 1. 먼저 배우 검색으로 person ID 찾기
      const searchResponse = await fetch(
        `/api/movies/search?query=${encodeURIComponent(personName)}`
      );

      if (!searchResponse.ok) {
        throw new Error("배우 검색 중 오류가 발생했습니다.");
      }

      const searchData = await searchResponse.json();
      const person = searchData.results?.find(
        (item: { media_type: string; id: number }) =>
          item.media_type === "person"
      );

      if (!person || !person.id) {
        throw new Error(`"${personName}" 배우 정보를 찾을 수 없습니다.`);
      }

      // 한글 이름 우선 사용
      setPersonName(person.name || personName);

      // 2. 배우 ID로 출연작 가져오기 (백엔드 API 사용)
      const creditsResponse = await fetch(
        `/api/search/person/${person.id}/credits`
      );

      if (!creditsResponse.ok) {
        throw new Error("출연작 정보를 가져올 수 없습니다.");
      }

      const creditsData: PersonCreditsResponse = await creditsResponse.json();

      // cast에서 영화만 필터링하고 poster_path가 있는 것만 선택
      const filteredCast = creditsData.cast
        .filter((credit) => credit.media_type === "movie" && credit.poster_path)
        .sort((a, b) => {
          // 최신 작품 순으로 정렬
          const dateA = a.release_date ? new Date(a.release_date).getTime() : 0;
          const dateB = b.release_date ? new Date(b.release_date).getTime() : 0;
          return dateB - dateA;
        })
        .slice(0, 20); // 최대 20개만 표시

      setCastCredits(filteredCast);
    } catch (err) {
      console.error("배우 출연작 조회 에러:", err);
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      );
      setCastCredits([]);
    } finally {
      setIsLoading(false);
    }
  };

  // name이 변경될 때마다 출연작 조회
  useEffect(() => {
    fetchPersonCredits(nameFromQuery);
  }, [nameFromQuery]);

  return (
    <section className="flex flex-col w-full max-w-7xl m-auto text-white">
      <h2 className="text-2xl font-bold my-8">
        {personName || nameFromQuery}의 출연작
      </h2>

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
          <p>출연작 정보를 불러올 수 없습니다.</p>
          <p className="text-sm mt-2">{error}</p>
        </div>
      )}

      {/* 출연작이 없는 경우 */}
      {!isLoading && !error && castCredits.length === 0 && nameFromQuery && (
        <div className="text-center text-gray-400">
          <p>&ldquo;{nameFromQuery}&rdquo;의 출연작 정보가 없습니다.</p>
        </div>
      )}

      {/* 출연작 표시 */}
      {!isLoading && !error && castCredits.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
          {castCredits.map((credit) => {
            const title = credit.title || credit.name || "제목 없음";
            const imageUrl = credit.poster_path
              ? `https://image.tmdb.org/t/p/w500${credit.poster_path}`
              : "/assets/images/no_poster_image.png";

            return (
              <div
                key={credit.id}
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
    </section>
  );
}

export default function ArtistPage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <ArtistPageContent />
    </Suspense>
  );
}
