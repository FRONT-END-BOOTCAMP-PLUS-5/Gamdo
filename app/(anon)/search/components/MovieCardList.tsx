import { CircleCard, PosterCard } from "@/app/components";

// 목데이터: 영화 이미지, 이름, 타입
const mockMovies = [
  {
    id: 1,
    imageUrl: "/assets/images/test_image_01.png",
    name: "케데헌",
    type: "영화",
  },
  {
    id: 2,
    imageUrl: "/assets/images/test_image_02.png",
    name: "오겜3",
    type: "감독",
  },
  {
    id: 3,
    imageUrl: "/assets/images/test_image_03.png",
    name: "무슨레이싱영화",
    type: "배우",
  },
  {
    id: 4,
    imageUrl: "/assets/images/test_image_04.png",
    name: "머시갱이",
    type: "영화",
  },
  {
    id: 5,
    imageUrl: "/assets/images/test_image_05.png",
    name: "폭삭",
    type: "영화",
  },
];

export default function MovieCardList() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
      {mockMovies.map((movie) =>
        movie.type === "배우" || movie.type === "감독" ? (
          <CircleCard
            key={movie.id}
            imageUrl={movie.imageUrl}
            name={movie.name}
          />
        ) : (
          <PosterCard
            key={movie.id}
            imageUrl={movie.imageUrl}
            name={movie.name}
          />
        )
      )}
      {/* 로딩중일때 스켈레톤 UI 표시 */}
      {/* {Array.from({ length: 8 }).map((_, index) => (
        <PosterCardSkeleton key={index} />
      ))} */}
    </div>
  );
}
