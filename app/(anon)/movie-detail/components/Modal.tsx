"use client";

import React, { useEffect } from "react";
import MoviePreviewInfo from "./MoviePreviewInfo";
import MovieReviewList from "./MovieReviewList";
import { IoMdCloseCircle } from "react-icons/io";

interface ModalProps {
  setModal: () => void;
}

const MovieDetailModal = ({ setModal }: ModalProps) => {
  const preventOffModal = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div
      onClick={setModal}
      className="fixed inset-0 z-50 flex justify-center items-center w-full min-h-screen bg-black/90 overflow-y-auto"
      style={{ alignItems: "flex-start" }} // 모달이 위에서부터 시작하도록
    >
      <div
        onClick={preventOffModal}
        className="bg-[#23272f] w-[900px] max-w-[98vw] rounded-2xl shadow-2xl flex flex-col text-white my-12 relative"
      >
        {/* Close Button */}
        <button
          onClick={setModal}
          className="absolute top-4 right-4 z-10 text-white cursor-pointer hover:text-gray-300 transition"
          aria-label="Close"
        >
          <IoMdCloseCircle size={36} />
        </button>
        <MoviePreviewInfo
          info={{
            releaseDate: "2025.06.22",
            rating: "12세 이상 관람가",
            genre: "드라마, 액션",
            country: "미국",
            runningTime: "155분",
          }}
        />
        <MovieReviewList />
      </div>
    </div>
  );
};

export default MovieDetailModal;
