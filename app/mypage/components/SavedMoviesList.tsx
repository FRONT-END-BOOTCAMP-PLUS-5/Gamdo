import { FaBookmark } from "react-icons/fa";

const dummyMovies = [
  { movie_id: '299534', title: '어벤져스: 엔드게임', poster: '/assets/posters/avengers.jpg' },
  { movie_id: '155', title: '다크 나이트', poster: '/assets/posters/darkknight.jpg' },
  { movie_id: '123', title: '인턴', poster: '/assets/posters/intern.jpg' },
  { movie_id: '456', title: 'A.I.', poster: '/assets/posters/ai.jpg' },
  { movie_id: '789', title: 'Her', poster: '/assets/posters/her.jpg' },
  { movie_id: '101', title: '워 호스', poster: '/assets/posters/warhorse.jpg' },
];

export default function SavedMoviesList() {
  return (
    <div className="mb-2 relative w-fit">
      {/* 볼래요 헤더 (박스 밖) */}
      <div className="flex items-center gap-1 mb-2 px-1">
        <span className="text-white text-[24px] font-medium">볼래요</span>
        <FaBookmark className="text-[24px] text-white" />
        <span className="text-white text-[24px] font-medium ml-1">({dummyMovies.length})</span>
      </div>
      {/* 더보기 버튼을 박스 밖 맨 오른쪽에 배치 */}
      <button className="absolute right-0 top-0 text-white text-base font-light">더보기</button>
      {/* 볼래요 박스 */}
      <div className="bg-[#17181d] rounded-xl pl-6 pr-6 w-[467px] h-[488px]">
        <div className="w-[435px] h-[413px] mx-auto overflow-hidden">
          <div className="grid grid-cols-3 grid-rows-2 gap-4 h-full">
            {dummyMovies.slice(0, 6).map((movie) => (
              <div key={movie.movie_id} className="flex flex-col items-center justify-center">
                <div className="w-[137px] h-[202px] bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}