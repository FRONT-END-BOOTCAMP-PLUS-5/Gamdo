"use client";
import { Modal, PosterCard, PosterCardSkeleton } from "@/app/components";
import { twMerge } from "tailwind-merge";
import { FaBookmark } from "react-icons/fa";
import { useState } from "react";
import SavedMoviesListModal from "./SavedMoviesListModal";
import { useSavedMovies } from "../hooks/useSavedMovies";

export default function SavedMoviesList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { savedMovies, moviesWithPosters, isLoading, isSuccess } =
    useSavedMovies(6);

  return (
    <section className="mb-2 relative w-fit">
      {isModalOpen && (
        <Modal setModal={() => setIsModalOpen(false)}>
          <SavedMoviesListModal />
        </Modal>
      )}

      <div className="flex items-center gap-1 text-xl font-medium mb-4">
        <h5>볼래요</h5>
        <FaBookmark className="text-[20px] text-white" />
        <span className="text-white text-xl font-medium">
          {isSuccess ? `(${savedMovies.totalCount})` : "(-)"}
        </span>
      </div>
      <span
        onClick={() => setIsModalOpen(true)}
        className="absolute right-0 top-0 text-white text-base font-light cursor-pointer"
      >
        더보기
      </span>
      {/* 볼래요 박스 */}
      <div className="relative flex justify-center items-center bg-[#17181D] rounded-xl pl-6 pr-6 w-[467px] min-h-[460px]">
        <div className="grid grid-cols-3 grid-rows-2 gap-4 h-full">
          <div
            onClick={() => setIsModalOpen(true)}
            className="absolute top-0 right-0 w-full h-full bg-transparent z-1 cursor-pointer"
          />
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
    </section>
  );
}
