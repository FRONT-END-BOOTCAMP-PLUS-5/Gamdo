import { useState, useEffect } from "react";
import axios from "@/utils/axios";
import { CreateSavedWatchDto } from "@/backend/application/saved-watch/dtos/CreateSavedWatchDto";

interface SavedMoviesListProps {
  items: CreateSavedWatchDto[];
  totalCount: number;
}

interface MovieWithPoster extends CreateSavedWatchDto {
  posterUrl?: string;
  title?: string;
}

export const useSavedMovies = (maxLength: number = 6) => {
  const [savedMovies, setSavedMovies] = useState<SavedMoviesListProps>({
    items: [],
    totalCount: 0,
  });
  const [moviesWithPosters, setMoviesWithPosters] = useState<MovieWithPoster[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  // 영화 상세 정보 가져오기
  const fetchMovieDetails = async (movieIds: string[]) => {
    setIsLoading(true);
    try {
      const movieDetailsPromises = movieIds.map(async (movieId) => {
        try {
          // 영화 상세 정보 API 호출
          const response = await fetch(`/api/movies/${movieId}`);
          const movieData = await response.json();

          if (movieData && movieData.poster_path) {
            return {
              movieId,
              userId:
                savedMovies.items.find((item) => item.movieId === movieId)
                  ?.userId || "",
              isRecommended:
                savedMovies.items.find((item) => item.movieId === movieId)
                  ?.isRecommended || false,
              posterUrl: `https://image.tmdb.org/t/p/w500${movieData.poster_path}`,
              title: movieData.title || movieId,
            } as MovieWithPoster;
          } else {
            // 포스터가 없는 경우 기본 정보만 추가
            const originalMovie = savedMovies.items.find(
              (item) => item.movieId === movieId
            );
            if (originalMovie) {
              return {
                ...originalMovie,
                posterUrl: "/assets/images/no_poster_image.png",
                title: movieId,
              } as MovieWithPoster;
            }
          }
        } catch (error) {
          console.error(`Error fetching details for movie ${movieId}:`, error);
          // 에러 발생 시 기본 정보만 추가
          const originalMovie = savedMovies.items.find(
            (item) => item.movieId === movieId
          );
          if (originalMovie) {
            return {
              ...originalMovie,
              posterUrl: "/assets/images/no_poster_image.png",
              title: movieId,
            } as MovieWithPoster;
          }
        }
        return null;
      });

      // 모든 API 호출을 병렬로 실행
      const results = await Promise.all(movieDetailsPromises);

      // null 값 필터링
      const moviesWithPosterData = results.filter(
        (result): result is MovieWithPoster => result !== null
      );

      setMoviesWithPosters(moviesWithPosterData);
    } catch (error) {
      console.error("Error fetching movie details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 찜한 영화 목록 가져오기
  const fetchSavedMovies = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/saved-watch?maxLength=${maxLength}`);
      console.log("API Response:", response.data);
      setSavedMovies(response.data);
      setIsSuccess(true);
    } catch (error) {
      console.error("Error fetching saved movies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 초기 데이터 로드
  useEffect(() => {
    fetchSavedMovies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxLength]);

  // savedMovies가 업데이트되면 영화 상세 정보 가져오기
  useEffect(() => {
    if (savedMovies.items.length > 0 && isSuccess) {
      const movieIds = savedMovies.items.map((item) => item.movieId);
      fetchMovieDetails(movieIds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedMovies.items, isSuccess]);

  return {
    savedMovies,
    moviesWithPosters,
    isLoading,
    isSuccess,
    fetchSavedMovies, // 필요시 수동으로 다시 호출 가능
  };
};
