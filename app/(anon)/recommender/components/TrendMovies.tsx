import PosterCard from "@/app/components/PosterCard";

// 최신 영화 데이터
const trendMovies = [
  {
    id: 1,
    imageUrl: "/assets/images/trendMovieImages/trendMovie01.webp",
    name: "84제곱미터",
    movieId: 1269208,
  },
  {
    id: 2,
    imageUrl: "/assets/images/trendMovieImages/trendMovie02.webp",
    name: "극장판 귀멸의 칼날: 무한성편",
    movieId: 1311031,
  },
  {
    id: 3,
    imageUrl: "/assets/images/trendMovieImages/trendMovie03.webp",
    name: "드래곤 길들이기",
    movieId: 1087192,
  },
  {
    id: 4,
    imageUrl: "/assets/images/trendMovieImages/trendMovie04.webp",
    name: "슈퍼맨",
    movieId: 1061474,
  },
  {
    id: 5,
    imageUrl: "/assets/images/trendMovieImages/trendMovie05.webp",
    name: "메간 2.0",
    movieId: 1071585,
  },
  {
    id: 6,
    imageUrl: "/assets/images/trendMovieImages/trendMovie06.webp",
    name: "판타스틱 4:새로운 출발",
    movieId: 617126,
  },
  {
    id: 7,
    imageUrl: "/assets/images/trendMovieImages/trendMovie07.webp",
    name: "어쩌다 파트너",
    movieId: 1374534,
  },
  {
    id: 8,
    imageUrl: "/assets/images/trendMovieImages/trendMovie08.webp",
    name: "발레리나",
    movieId: 541671,
  },
  //   {
  //     id: 9,
  //     imageUrl: "/assets/images/trendMovieImages/trendMovie09.webp",
  //     name: "지암",
  //     movieId: 1429744,
  //   },
  //   {
  //     id: 10,
  //     imageUrl: "/assets/images/trendMovieImages/trendMovie10.webp",
  //     name: "국가 원수",
  //     movieId: 749170,
  //   },
];

interface TrendMoviesProps {
  onPosterClick?: (movieTitle: string) => void;
}

const TrendMovies: React.FC<TrendMoviesProps> = ({ onPosterClick }) => {
  return (
    <div className="mt-10">
      <div className="flex p-6 mb-6">
        <div className="flex-start text-3xl font-bold text-white">
          최신 영화
        </div>
      </div>

      {/* 최신 영화 카드 flex - 한 줄에 5개씩 총 2줄 */}
      <div className="flex justify-around flex-wrap gap-8">
        {trendMovies.map((movie) => (
          <div
            key={movie.id}
            onClick={() => onPosterClick?.(movie.name)}
            className="w-[20%] cursor-pointer"
          >
            <PosterCard
              imageUrl={movie.imageUrl}
              name={movie.name}
              className="w-full hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendMovies;
