import React, { useState } from "react";
import Image from "next/image";
import { FaCalendarAlt, FaRegBookmark, FaBookmark } from "react-icons/fa";

const MovieHeader = () => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleBookmarkToggle = () => {
    setIsBookmarked(!isBookmarked);
  };

  return (
    <>
      <div
        className="flex gap-3  min-w-[600px] flex-1 h-16 rounded-xl items-center px-4 py-2 justify-center"
        style={{ backgroundColor: "rgb(22, 18, 20)" }}
      >
        <Image
          src="/assets/images/netflix.png"
          alt="netflix"
          width={40}
          height={40}
          className="w-10 h-10 "
        />
        <Image
          src="/assets/images/disney-plus.svg"
          alt="disney+"
          width={40}
          height={40}
          className="w-10 h-10"
        />
      </div>
      <div
        className="flex gap-2 h-16 items-center px-4 py-2 justify-center rounded-xl"
        style={{ backgroundColor: "rgb(22, 18, 20)" }}
      >
        <button className="bg-[#31343c] rounded-lg p-2 hover:bg-[#444857] cursor-pointer">
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
      </div>
    </>
  );
};

export default MovieHeader;
