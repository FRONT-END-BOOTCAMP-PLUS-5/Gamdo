import { PosterCard, PosterCardSkeleton } from "@/app/components";
import { twMerge } from "tailwind-merge";
import { useSavedMovies } from "../hooks/useSavedMovies";

export default function SavedMoviesListModal() {
  const { savedMovies, moviesWithPosters, isLoading, isSuccess } =
    useSavedMovies(20); // 더 많은 영화 표시

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col">
      <section className="p-10 flex items-center gap-1 text-2xl font-medium mt-4  text-white">
        <h5>볼래요</h5>
        <span className="text-white text-xl font-medium">
          {isSuccess ? `(${savedMovies.totalCount})` : "(-)"}
        </span>
      </section>
      <section
        className="flex-1 overflow-y-auto px-12 py-4"
        style={{
          scrollbarColor: "#6b7280 transparent",
        }}
      >
        <div className="grid grid-cols-4 gap-4">
          {isLoading &&
            Array.from({ length: 8 }).map((_, index) => (
              <PosterCardSkeleton
                key={index}
                className={twMerge("w-[186px] rounded-lg")}
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
                  className={twMerge("w-[186px] object-cover rounded-lg")}
                />
              </div>
            ))}
          {isSuccess && !isLoading && savedMovies.items.length === 0 && (
            <div className="col-span-4 flex items-center justify-center text-gray-500 py-10">
              찜한 영화가 없습니다 😣
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
