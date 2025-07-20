import { useReviews } from "../hooks/useReviews";
import { useMovieTitle } from "../hooks/useMovieTitle";
import { FaPen } from "react-icons/fa";

/**
 * 날짜를 포맷팅하는 함수
 * @param dateString - ISO 날짜 문자열
 * @returns 포맷팅된 날짜 문자열 (YYYY.MM.DD)
 */
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
};

/**
 * 영화 제목 컴포넌트
 * @param movieId - 영화 ID
 * @returns 영화 제목 또는 로딩 상태
 */
const MovieTitle = ({ movieId }: { movieId: string }) => {
  const { title, isLoading } = useMovieTitle(movieId);

  if (isLoading) {
    return <span className="text-gray-400">로딩 중...</span>;
  }

  return <span>{title}</span>;
};

export default function ReviewSummaryModal() {
  const { reviews, isLoading, error } = useReviews();

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col">
      <section className="p-10 flex items-center gap-1 text-2xl font-medium mt-4 text-white">
        <h5>한줄평</h5>
        <FaPen className="ml-1 text-[24px] text-white" />
        <span className="text-white text-xl font-medium">
          {!isLoading && !error ? `(${reviews.length})` : "(-)"}
        </span>
      </section>
      <section
        className="flex-1 overflow-y-auto px-12 py-4"
        style={{
          scrollbarColor: "#6b7280 transparent",
        }}
      >
        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-[#17181D] rounded-xl p-6">
                <div className="h-4 w-32 mb-2 bg-gray-600 rounded animate-pulse" />
                <div className="h-6 w-full bg-gray-600 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-400">
              <p className="text-lg">리뷰를 불러오는 중 오류가 발생했습니다.</p>
              <p className="text-sm mt-2">잠시 후 다시 시도해주세요.</p>
            </div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-400">
              <p className="text-lg">아직 작성한 한줄평이 없습니다.</p>
              <p className="text-sm mt-2">영화를 보고 한줄평을 남겨보세요!</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="bg-[#17181D] rounded-xl p-6">
                <div className="text-gray-200 text-[16px] font-semibold mb-3">
                  <MovieTitle movieId={review.movieId} />
                  <span className="mx-2">|</span>
                  {formatDate(review.createdAt)}
                </div>
                <div className="text-white text-[18px] leading-[140%] text-left">
                  {review.content}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
