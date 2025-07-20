import { useReviews } from "../hooks/useReviews";
import { useMovieTitle } from "../hooks/useMovieTitle";
import { FaPen } from "react-icons/fa";
import { useState } from "react";
import { Modal } from "@/app/components";
import ReviewSummaryModal from "./ReviewSummaryModal";

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

export default function ReviewSummary() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { reviews, isLoading, error } = useReviews();

  // 로딩 상태 처리
  if (isLoading) {
    return (
      <div className="mb-2 w-[470px]">
        {isModalOpen && (
          <Modal setModal={() => setIsModalOpen(false)}>
            <ReviewSummaryModal />
          </Modal>
        )}
        <div className="flex justify-between items-center w-full text-xl font-medium mb-4">
          <div className="flex items-center gap-1">
            <span>한줄평</span>
            <FaPen className="text-[20px] text-white" />
            <span>(0)</span>
          </div>
          <button
            className="text-base font-light cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            더보기
          </button>
        </div>
        <div className="bg-[#17181D] rounded-xl p-6 min-h-[281px]">
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <div className="h-4 w-32 mb-2 bg-gray-600 rounded animate-pulse" />
                <div className="h-6 w-full bg-gray-600 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 에러 상태 처리
  if (error) {
    return (
      <div className="mb-2 w-[470px]">
        {isModalOpen && (
          <Modal setModal={() => setIsModalOpen(false)}>
            <ReviewSummaryModal />
          </Modal>
        )}
        <div className="flex justify-between items-center w-full text-xl font-medium mb-4">
          <div className="flex items-center gap-1">
            <span>한줄평</span>
            <FaPen className="text-[20px] text-white" />
            <span>(0)</span>
          </div>
          <button
            className="text-base font-light cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            더보기
          </button>
        </div>
        <div className="bg-[#17181D] rounded-xl p-6 min-h-[281px] flex items-center justify-center">
          <div className="text-center text-gray-400">
            <p className="text-sm">리뷰를 불러오는 중 오류가 발생했습니다.</p>
            <p className="text-xs mt-1">잠시 후 다시 시도해주세요.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-2 w-[470px]">
      {isModalOpen && (
        <Modal setModal={() => setIsModalOpen(false)}>
          <ReviewSummaryModal />
        </Modal>
      )}
      {/* 한줄평 헤더 (박스 밖) */}
      <div className="flex justify-between items-center w-full text-xl font-medium mb-4">
        <div className="flex items-center gap-1">
          <span>한줄평 </span>
          <FaPen className="ml-1 text-[20px] text-white" />
          <span>({reviews.length})</span>
        </div>
        <button
          className="text-base font-light cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          더보기
        </button>
      </div>
      {/* 한줄평 박스 */}
      <div className="bg-[#17181D] rounded-xl p-6 min-h-[281px]">
        {reviews.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-400">
              <p className="text-sm">아직 작성한 한줄평이 없습니다.</p>
              <p className="text-xs mt-1">영화를 보고 한줄평을 남겨보세요!</p>
            </div>
          </div>
        ) : (
          <ul>
            {reviews.slice(0, 3).map((review, idx) => (
              <li key={review.id} className={`${idx === 2 ? "mb-0" : "mb-6"}`}>
                <div className="text-gray-200 text-[15px] font-semibold">
                  <MovieTitle movieId={review.movieId} />
                  <span className="mx-1">|</span> {formatDate(review.createdAt)}
                </div>
                <div className="text-white text-[18px] mt-1 leading-[140%] text-left w-full overflow-hidden">
                  <div
                    className="break-words"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      lineHeight: "140%",
                      maxHeight: "calc(1.4em * 2)",
                    }}
                  >
                    {review.content}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
