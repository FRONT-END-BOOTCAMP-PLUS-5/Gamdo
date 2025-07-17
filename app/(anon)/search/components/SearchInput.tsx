"use client";
import Image from "next/image";
import React from "react";

interface SearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
}

export default function SearchInput({
  value,
  onChange,
  onSearch,
}: SearchInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className="w-full flex flex-col items-center py-8">
      <h2 className="text-2xl font-bold mb-6">어떤 영화를 검색할까요?</h2>
      <div className="relative w-full max-w-3xl">
        <input
          type="text"
          placeholder="제목, 감독, 배우 등 키워드 검색을 통해 검색할 수 있어요"
          className="w-full bg-[#DEFFFD] text-gray-700 placeholder-gray-500 rounded-[32px] py-4 pl-8 pr-12 text-lg border-none outline-none shadow-none"
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          className="absolute right-6 top-1/2 -translate-y-1/2"
          onClick={onSearch}
          aria-label="검색"
        >
          <Image
            src="/assets/icons/search_icon.svg"
            alt="검색"
            width={24}
            height={24}
          />
        </button>
      </div>
    </div>
  );
}
