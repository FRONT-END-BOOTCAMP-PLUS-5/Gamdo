import React, { useState, useEffect } from "react";
import { CgProfile } from "react-icons/cg";
import Image from "next/image";
import axiosInstance from "@/utils/axios";
import { useParams } from "next/navigation";

interface MovieReviewListProps {
  movieId?: number | string;
}

interface Review {
  id: number;
  userId: string;
  movieId: string;
  content: string;
  createdAt?: string;
  nickname?: string;
  profile?: string;
  date?: string;
}

// 리뷰 등록 함수
async function postReview(movieId: string, content: string) {
  const response = await axiosInstance.post("/reviews", {
    movieId,
    content,
  });
  return response.data;
}

const MovieReviewList = (props: MovieReviewListProps) => {
  const params = useParams();
  const movieId =
    props.movieId !== undefined
      ? String(props.movieId)
      : params?.id !== undefined
      ? String(params.id)
      : undefined;

  const [open, setOpen] = useState(false);
  const [newContent, setNewContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 리뷰 목록 fetch 함수
  const fetchReviews = async () => {
    if (!movieId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get(`/reviews?movieId=${movieId}`);
      setReviews(res.data.reviews || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "리뷰를 불러오는 중 오류가 발생했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movieId]);

  if (!movieId) {
    return <div className="text-red-400">영화 정보가 없습니다.</div>;
  }

  // 펼쳤을 때 모든 리뷰, 접었을 때 첫 리뷰만
  const visibleReviews = open ? reviews : reviews.slice(0, 1);

  // 리뷰 등록 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;
    setSubmitting(true);
    try {
      await postReview(movieId, newContent);
      setNewContent("");
      await fetchReviews();
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "리뷰 등록 중 오류가 발생했습니다."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 pt-0 bg-transparent">
      {/* 리뷰 입력창 */}
      <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
        <input
          type="text"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          placeholder="한줄평을 입력하세요"
          className="flex-1 px-4 py-2 rounded-lg bg-[#232326] text-white"
          disabled={submitting}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-gray-600 text-white rounded-lg cursor-pointer"
          disabled={submitting}
        >
          등록
        </button>
      </form>
      <div className="font-semibold mb-2 text-white text-left">
        한줄평({reviews.length})
      </div>
      <div>
        {loading && <div className="text-gray-400">로딩중...</div>}
        {error && <div className="text-red-400">{error}</div>}
        {visibleReviews.map((review) => (
          <div
            key={review.id}
            className="flex items-start gap-4 bg-[#232326]/90 rounded-xl p-6 mb-3 cursor-pointer"
            onClick={() => {
              if (!open) setOpen(true);
            }}
          >
            {review.profile ? (
              <Image
                src={review.profile}
                alt="profile"
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover border-2 border-gray-600 shadow"
              />
            ) : (
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-700 border-2 border-gray-600 shadow">
                <CgProfile size={32} color="#bbb" />
              </div>
            )}
            <div className="flex-1 text-left">
              <div className="flex items-center mb-1">
                <span className="font-bold text-base text-white text-left">
                  {review.nickname || "익명"}
                </span>
                <span className="text-xs text-gray-400 ml-3 text-left">
                  {review.createdAt
                    ? new Date(review.createdAt)
                        .toLocaleString("ko-KR", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })
                        .replace(/\.$/, "") // 마지막 점 제거
                    : ""}
                </span>
              </div>
              <div className="text-gray-200 text-sm leading-relaxed text-left">
                {review.content}
              </div>
            </div>
          </div>
        ))}
        {/* 펼쳐진 상태에서만 '리뷰 접기' 텍스트 버튼 표시 */}
        {open && (
          <button
            className="block mx-auto mt-2 text-xs text-gray-400 hover:text-white cursor-pointer"
            onClick={() => setOpen(false)}
          >
            리뷰 접기
          </button>
        )}
      </div>
    </div>
  );
};

export default MovieReviewList;
