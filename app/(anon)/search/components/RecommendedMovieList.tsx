import MovieCardList from "./MovieCardList";

export default function RecommendedMovieList() {
  //여기서 추천영화 get요청 실행

  return (
    <section className="w-full mx-auto mt-4">
      <h3 className="text-xl font-bold mb-6">요즘 뜨고 있는 콘텐츠</h3>
      <MovieCardList />
    </section>
  );
}
