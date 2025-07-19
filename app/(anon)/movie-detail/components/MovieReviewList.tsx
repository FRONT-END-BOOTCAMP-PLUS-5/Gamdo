import React, { useState } from "react";
import { CgProfile } from "react-icons/cg";
import Image from "next/image";

const reviews = [
  {
    id: 1,
    nickname: "아윤이",
    date: "2025.06.30",
    content:
      "최고가 되지 못한 천설 VS 최고가 되고 싶은 루키 가슴이 웅장해진다...",
    profile: "/assets/images/test_image_01.png",
  },
  {
    id: 2,
    nickname: "아윤이",
    date: "2025.06.30",
    content:
      "최고가 되지 못한 천설 VS 최고가 되고 싶은 루키 가슴이 웅장해진다...",
    profile: "/assets/images/test_image_01.png",
  },
];

const MovieReviewList = () => {
  const [open, setOpen] = useState(false);

  // 펼쳤을 때 모든 리뷰, 접었을 때 첫 리뷰만
  const visibleReviews = open ? reviews : reviews.slice(0, 1);

  return (
    <div className="p-6 pt-0 bg-transparent">
      <div className="font-semibold mb-2 text-white text-left">
        한줄평({reviews.length})
      </div>
      <div>
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
                  {review.nickname}
                </span>
                <span className="text-xs text-gray-400 ml-3 text-left">
                  {review.date}
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
