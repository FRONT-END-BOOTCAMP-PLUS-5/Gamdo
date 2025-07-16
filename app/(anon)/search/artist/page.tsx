import MovieCardList from "../components/MovieCardList";
// import { EmptyContents } from "@/app/components";

export default function ArtistPage() {
  return (
    <section className="flex flex-col w-full max-w-7xl m-auto text-white">
      <h2 className="text-2xl font-bold my-8">
        {"배우, 감독 페이지임. 여기에 배우 or 감독명으로 데이터매핑 필요"}
      </h2>
      <MovieCardList />
      {/* 검색 결과가 없을 때 MovieCardList와 조건부 렌더링 추가 */}
      {/* <EmptyContents text="검색 결과가 없습니다 :(" /> */}
    </section>
  );
}
