import { useState, useEffect } from "react";
import axios from "@/utils/axios";

interface UseBookmarkProps {
  movieId?: string;
}

interface BookmarkResponse {
  success: boolean;
  isSaved: boolean;
  savedWatch: {
    userId: string;
    movieId: string;
    isRecommended: boolean;
    createdAt: string;
  } | null;
  message: string;
}

export const useBookmark = ({ movieId }: UseBookmarkProps) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 영화 정보가 로드될 때 찜하기 상태 확인
  useEffect(() => {
    if (movieId) {
      checkBookmarkStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movieId]);

  const checkBookmarkStatus = async () => {
    if (!movieId) return;

    setIsLoading(true);
    try {
      const response = await axios.get<BookmarkResponse>(
        `/saved-watch?movieId=${movieId}`
      );

      if (response.data.success) {
        setIsBookmarked(response.data.isSaved);
      }
    } catch (error) {
      console.error("찜하기 상태 확인 중 오류:", error);
      // 에러 발생 시 기본값 유지
    } finally {
      setIsLoading(false);
    }
  };

  const toggleBookmark = async () => {
    if (!movieId) return;

    try {
      if (isBookmarked) {
        // 찜하기 취소
        await axios.delete("/saved-watch", {
          data: { movieId },
        });
        setIsBookmarked(false);
      } else {
        // 찜하기 추가
        await axios.post("/saved-watch", {
          movieId,
          isRecommended: true,
        });
        setIsBookmarked(true);
      }
    } catch (error) {
      console.error("찜하기 토글 중 오류:", error);
    }
  };

  return {
    isBookmarked,
    isLoading,
    toggleBookmark,
    checkBookmarkStatus,
  };
};
