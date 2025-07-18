"use client";
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

  useEffect(() => {
    const fetchSavedMovies = async () => {
      try {
        const response = await axios.get("/saved-watch?maxLength=6");
        console.log("API Response:", response.data);
        setSavedMovies(response.data);
      } catch (error) {
        console.error("Error fetching saved movies:", error);
      }
    };
    fetchSavedMovies();
  }, []);

  console.log("Current state:", savedMovies);

  return (
    <div className="mb-2 relative w-fit">
      {/* 볼래요 헤더 (박스 밖) */}
      <div className="flex items-center gap-1 text-xl font-medium mb-4">
        <span>볼래요</span>
        <FaBookmark className="text-[20px] text-white" />
        <span className="text-white text-xl font-medium">
          ({savedMovies.totalCount})
        </span>
      </div>
      {/* 더보기 버튼을 박스 밖 맨 오른쪽에 배치 */}
      <button className="absolute right-0 top-0 text-white text-base font-light cursor-pointer">
        더보기
      </button>
      {/* 볼래요 박스 */}
      <div className="flex justify-center items-center bg-[#17181D] rounded-xl pl-6 pr-6 w-[467px] min-h-[460px]">
        <div className="grid grid-cols-3 grid-rows-2 gap-4 h-full">
          {savedMovies.items.length > 0 ? (
            savedMovies.items.map((movie) => (
              <div
                key={movie.movieId}
                className="flex flex-col items-center justify-center"
              >
                <div className="w-[137px] h-[202px] bg-gray-700 rounded"></div>
              </div>
            ))
          ) : (
            <div className="col-span-3 row-span-2 flex items-center justify-center text-gray-500">
              찜한 영화가 없습니다
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
