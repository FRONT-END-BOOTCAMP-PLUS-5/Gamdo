"use client";
import { PosterCard, PosterCardSkeleton } from "@/app/components";
import { CreateSavedWatchDto } from "@/backend/application/saved-watch/dtos/CreateSavedWatchDto";
import axios from "@/utils/axios";
import { useEffect, useState } from "react";
import { FaBookmark } from "react-icons/fa";

interface SavedMoviesListProps {
  items: CreateSavedWatchDto[];
  totalCount: number;
}

export default function SavedMoviesList() {
  const [savedMovies, setSavedMovies] = useState<SavedMoviesListProps>({
    items: [],
    totalCount: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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
          {isLoading &&
            Array.from({ length: 6 }).map((_, index) => (
              <PosterCardSkeleton key={index} className="w-[130px]" />
            ))}
          {!isLoading &&
            savedMovies.items.length > 0 &&
            savedMovies.items.map((movie) => (
              <div
                key={movie.movieId}
                className="flex flex-col items-center justify-center"
              >
                <PosterCard
                  imageUrl={"/assets/images/test_image_01.png"}
                  name={"test"}
                  className="w-[130px] rounded-[5px] object-cover"
                />
              </div>
            ))}
          {isSuccess && savedMovies.items.length === 0 && (
            <div className="col-span-3 row-span-2 flex items-center justify-center text-gray-500">
              찜한 영화가 없습니다 😣
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
