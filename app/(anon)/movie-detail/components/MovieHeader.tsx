import React, { useState } from "react";
import Image from "next/image";
import { FaCalendarAlt, FaRegBookmark, FaBookmark } from "react-icons/fa";
import { getPlatformImages } from "@/app/components/Platform";
import MovieHeaderCalendar from "./MovieHeaderCalendar";
import axios from "@/utils/axios";
import { toast } from "react-toastify";

interface MovieHeaderProps {
  ottProviders?: string[];
  movieId?: string;
}

const MovieHeader = ({ ottProviders = [], movieId }: MovieHeaderProps) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleBookmarkToggle = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleCalendarToggle = () => {
    setIsCalendarOpen(!isCalendarOpen);
  };

  const handleDateSelect = async (date: Date) => {
    if (!movieId) {
      toast.error("영화 정보를 찾을 수 없습니다.");
      return;
    }

    try {
      // 날짜를 YYYY-MM-DD 형식으로 변환
      const formattedDate = date.toISOString().split("T")[0];

      const response = await axios.post("/saves", {
        movieId,
        selectedDate: formattedDate,
      });

      if (response.data.success) {
        toast.success("영화가 캘린더에 저장되었습니다!");
        // 캘린더 닫기
        setIsCalendarOpen(false);
      } else {
        toast.error(response.data.message || "저장에 실패했습니다.");
      }
    } catch (error: unknown) {
      console.error("영화 저장 중 오류:", error);

      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        if (axiosError.response?.data?.message) {
          toast.error(axiosError.response.data.message);
        } else {
          toast.error("영화 저장 중 오류가 발생했습니다.");
        }
      } else {
        toast.error("영화 저장 중 오류가 발생했습니다.");
      }
    }
  };

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
        className="flex gap-2 h-16 items-center px-4 py-2 justify-center rounded-xl relative"
        style={{ backgroundColor: "rgb(22, 18, 20)" }}
      >
        <button
          className="bg-[#31343c] rounded-lg p-2 hover:bg-[#444857] cursor-pointer"
          onClick={handleCalendarToggle}
        >
          <FaCalendarAlt size={24} color="#fff" />
        </button>
        <button
          className="bg-[#31343c] rounded-lg p-2 hover:bg-[#444857] cursor-pointer"
          onClick={handleBookmarkToggle}
        >
          {isBookmarked ? (
            <FaBookmark size={24} color="#fff" />
          ) : (
            <FaRegBookmark size={24} color="#fff" />
          )}
        </button>

        <MovieHeaderCalendar
          isOpen={isCalendarOpen}
          onDateSelect={handleDateSelect}
          movieId={movieId}
        />
      </div>
    </>
  );
};

export default MovieHeader;
