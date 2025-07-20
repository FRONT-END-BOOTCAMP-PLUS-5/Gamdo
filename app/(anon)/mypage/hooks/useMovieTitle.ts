import { useState, useEffect } from "react";
import axiosInstance from "@/utils/axios";

// 영화 정보 타입 정의
interface MovieInfo {
  id: number;
  title: string;
  poster_path?: string;
  release_date?: string;
}

// API 응답 타입 정의
interface MovieResponse {
  movie: MovieInfo;
}

/**
 * 영화 ID로 영화 제목을 가져오는 커스텀 훅
 * @param movieId - 영화 ID
 * @returns 영화 제목, 로딩 상태, 에러 상태
 */
export const useMovieTitle = (movieId: string) => {
  const [title, setTitle] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieTitle = async () => {
      if (!movieId) {
        console.log("🎬 movieId가 없음");
        setTitle("");
        setIsLoading(false);
        return;
      }

      try {
        console.log(`🎬 영화 제목 가져오기 시작 - movieId: ${movieId}`);
        setIsLoading(true);
        setError(null);

        // movieId에서 숫자 부분만 추출 (예: "1269208-84" -> "1269208")
        const numericMovieId = movieId.split("-")[0];
        console.log(`🔢 추출된 숫자 movieId: ${numericMovieId}`);

        console.log(`📡 TMDB API 요청 중... /movies?movieId=${numericMovieId}`);
        const response = await axiosInstance.get<MovieResponse>(
          `/movies?movieId=${numericMovieId}`
        );
        console.log("✅ TMDB API 응답:", response.data);

        const movieTitle = response.data.movie.title || `영화 ${movieId}`;
        console.log(`🎬 설정된 영화 제목: ${movieTitle}`);
        setTitle(movieTitle);
      } catch (err) {
        console.error("❌ 영화 제목 가져오기 실패:", err);
        console.error("❌ 에러 상세:", {
          message: err instanceof Error ? err.message : "Unknown error",
        });
        setError(
          err instanceof Error
            ? err.message
            : "영화 제목을 가져오는 중 오류가 발생했습니다."
        );
        // 에러 발생 시 기본값 설정
        setTitle(`영화 ${movieId}`);
      } finally {
        setIsLoading(false);
        console.log("🏁 영화 제목 로딩 완료");
      }
    };

    fetchMovieTitle();
  }, [movieId]);

  return { title, isLoading, error };
};
