import React from "react";
import Image from "next/image";
import { FaCalendarAlt, FaRegBookmark, FaBookmark } from "react-icons/fa";
import { getPlatformImages } from "@/app/components/Platform";
import { useBookmark } from "../hooks/useBookmark";

interface MovieHeaderProps {
  ottProviders?: string[];
  movieId?: string;
}

const MovieHeader = ({ ottProviders = [], movieId }: MovieHeaderProps) => {
  const { isBookmarked, isLoading, toggleBookmark } = useBookmark({ movieId });

  // OTT 제공자 이미지 경로 배열 가져오기
  const platformImages = getPlatformImages(ottProviders);

  return (
    <>
      <div
        className="flex gap-3 min-w-[600px] flex-1 h-16 rounded-xl items-center px-4 py-2 justify-center"
        style={{ backgroundColor: "rgb(22, 18, 20)" }}
      >
        {platformImages.length > 0 ? (
          platformImages.map((imagePath, index) => (
            <Image
              key={index}
              src={imagePath}
              alt={`platform-${index}`}
              width={56}
              height={56}
              className="w-14 h-14 rounded-xl"
            />
          ))
        ) : (
          // 플랫폼 정보가 없을 때 기본 이미지들 표시
          <>
            <Image
              src="/assets/images/netflix.png"
              alt="netflix"
              width={56}
              height={56}
              className="w-14 h-14 rounded-xl"
            />
            <Image
              src="/assets/images/disney-plus.svg"
              alt="disney+"
              width={56}
              height={40}
              className="w-14 h-14 rounded-xl"
            />
          </>
        )}
      </div>
      <div
        className="flex gap-2 h-16 items-center px-4 py-2 justify-center rounded-xl"
        style={{ backgroundColor: "rgb(22, 18, 20)" }}
      >
        <button className="bg-[#31343c] rounded-lg p-2 hover:bg-[#444857] cursor-pointer">
          <FaCalendarAlt size={24} color="#fff" />
        </button>
        <button
          className="bg-[#31343c] rounded-lg p-2 hover:bg-[#444857] cursor-pointer disabled:opacity-50"
          onClick={toggleBookmark}
          disabled={isLoading}
        >
          {isBookmarked ? (
            <FaBookmark size={24} color="#56EBE1" />
          ) : (
            <FaRegBookmark size={24} color="#fff" />
          )}
        </button>
      </div>
    </>
  );
};

export default MovieHeader;
