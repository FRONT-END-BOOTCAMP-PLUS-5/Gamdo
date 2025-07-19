import PosterCard from "@/app/components/PosterCard";

// 최신 영화 데이터
const trendMovies = [
  {
    id: 1,
    imageUrl: "/assets/images/trendMovieImages/trendMovie01.webp",
    name: "84제곱미터",
  },
  {
    id: 2,
    imageUrl: "/assets/images/trendMovieImages/trendMovie02.webp",
    name: "극장판 귀멸의 칼날: 무한성편",
  },
  {
    id: 3,
    imageUrl: "/assets/images/trendMovieImages/trendMovie03.webp",
    name: "드래곤 길들이기",
  },
  {
    id: 4,
    imageUrl: "/assets/images/trendMovieImages/trendMovie04.webp",
    name: "슈퍼맨",
  },
  {
    id: 5,
    imageUrl: "/assets/images/trendMovieImages/trendMovie05.webp",
    name: "메간 2.0",
  },
  {
    id: 6,
    imageUrl: "/assets/images/trendMovieImages/trendMovie06.webp",
    name: "판타스틱 4:새로운 출발",
  },
  {
    id: 7,
    imageUrl: "/assets/images/trendMovieImages/trendMovie07.webp",
    name: "어쩌다 파트너",
  },
  {
    id: 8,
    imageUrl: "/assets/images/trendMovieImages/trendMovie08.webp",
    name: "발레리나",
  },
  {
    id: 9,
    imageUrl: "/assets/images/trendMovieImages/trendMovie09.webp",
    name: "지암",
  },
  {
    id: 10,
    imageUrl: "/assets/images/trendMovieImages/trendMovie10.webp",
    name: "국가 원수",
  },
];

const TrendMovies = () => {
  return (
    <div className="mt-10">
      <div className="flex border-2 border-white p-4 rounded-lg mb-8">
        <div className="flex-start text-2xl font-bold text-white">
          최신 영화
        </div>
      </div>

      {/* 최신 영화 카드 flex - 한 줄에 5개씩 총 2줄 */}
      <div className="flex justify-around flex-wrap gap-8">
        {trendMovies.map((movie) => (
          <PosterCard
            key={movie.id}
            imageUrl={movie.imageUrl}
            name={movie.name}
            className="w-[18%] flex-shrink-0 hover:scale-105 transition-transform duration-300"
          />
        ))}
      </div>
    </div>
  );
};

export default TrendMovies;
