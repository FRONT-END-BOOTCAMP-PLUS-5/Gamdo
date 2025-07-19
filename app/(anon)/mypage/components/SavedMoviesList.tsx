"use client";
import { PosterCard, PosterCardSkeleton } from "@/app/components";
import { CreateSavedWatchDto } from "@/backend/application/saved-watch/dtos/CreateSavedWatchDto";
import axios from "@/utils/axios";
import { useEffect, useState } from "react";
import { FaBookmark } from "react-icons/fa";
import { twMerge } from "tailwind-merge";

interface SavedMoviesListProps {
  items: CreateSavedWatchDto[];
  totalCount: number;
}

interface MovieWithPoster extends CreateSavedWatchDto {
  posterUrl?: string;
  title?: string;
}

export default function SavedMoviesList() {
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
      const moviesWithPosterData: MovieWithPoster[] = [];

      for (const movieId of movieIds) {
        try {
          // 영화 상세 정보 API 호출
          const response = await fetch(`/api/movies/${movieId}`);
          const movieData = await response.json();

          if (movieData && movieData.poster_path) {
            moviesWithPosterData.push({
              movieId,
              userId:
                savedMovies.items.find((item) => item.movieId === movieId)
                  ?.userId || "",
              isRecommended:
                savedMovies.items.find((item) => item.movieId === movieId)
                  ?.isRecommended || false,
              posterUrl: `https://image.tmdb.org/t/p/w500${movieData.poster_path}`,
              title: movieData.title || movieId,
            });
          } else {
            // 포스터가 없는 경우 기본 정보만 추가
            const originalMovie = savedMovies.items.find(
              (item) => item.movieId === movieId
            );
            if (originalMovie) {
              moviesWithPosterData.push({
                ...originalMovie,
                posterUrl: "/assets/images/no_poster_image.png",
                title: movieId,
              });
            }
          }
        } catch (error) {
          console.error(`Error fetching details for movie ${movieId}:`, error);
          // 에러 발생 시 기본 정보만 추가
          const originalMovie = savedMovies.items.find(
            (item) => item.movieId === movieId
          );
          if (originalMovie) {
            moviesWithPosterData.push({
              ...originalMovie,
              posterUrl: "/assets/images/no_poster_image.png",
              title: movieId,
            });
          }
        }
      }

      setMoviesWithPosters(moviesWithPosterData);
    } catch (error) {
      console.error("Error fetching movie details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchSavedMovies = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("/saved-watch?maxLength=6");
        console.log("API Response:", response.data);
        setSavedMovies(response.data);
        setIsSuccess(true);
      } catch (error) {
        console.error("Error fetching saved movies:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSavedMovies();
  }, []);

  // savedMovies가 업데이트되면 영화 상세 정보 가져오기
  useEffect(() => {
    if (savedMovies.items.length > 0 && isSuccess) {
      const movieIds = savedMovies.items.map((item) => item.movieId);
      fetchMovieDetails(movieIds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedMovies.items, isSuccess]);

  return (
    <div className="mb-2 relative w-fit">
      <div className="flex items-center gap-1 text-xl font-medium mb-4">
        <span>볼래요</span>
        <FaBookmark className="text-[20px] text-white" />
        <span className="text-white text-xl font-medium">
          {isSuccess ? `(${savedMovies.totalCount})` : "(-)"}
        </span>
      </div>
      <button className="absolute right-0 top-0 text-white text-base font-light cursor-pointer">
        더보기
      </button>
      {/* 볼래요 박스 */}
      <div className="flex justify-center items-center bg-[#17181D] rounded-xl pl-6 pr-6 w-[467px] min-h-[460px]">
        <div className="grid grid-cols-3 grid-rows-2 gap-4 h-full">
          <div className="absolute top-0 right-0 w-full h-full bg-transparent z-1" />
          {isLoading &&
            Array.from({ length: 6 }).map((_, index) => (
              <PosterCardSkeleton
                key={index}
                className={twMerge("w-[130px] rounded-lg")}
              />
            ))}
          {!isLoading &&
            moviesWithPosters.length > 0 &&
            moviesWithPosters.map((movie) => (
              <div
                key={movie.movieId}
                className="flex flex-col items-center justify-center"
              >
                <PosterCard
                  imageUrl={
                    movie.posterUrl || "/assets/images/no_poster_image.png"
                  }
                  name={movie.title || movie.movieId}
                  className={twMerge("w-[130px] object-cover rounded-lg")}
                />
              </div>
            ))}
          {isSuccess && !isLoading && savedMovies.items.length === 0 && (
            <div className="col-span-3 row-span-2 flex items-center justify-center text-gray-500">
              찜한 영화가 없습니다 😣
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
