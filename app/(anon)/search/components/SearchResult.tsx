import React from "react";
import MovieCardList from "./MovieCardList";
// import { BsFillCloudRainFill } from "react-icons/bs";

import { useSearchParams } from "next/navigation";

interface SearchResultProps {
  type: string;
  onTypeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function SearchResult({
  type,
  onTypeChange,
}: SearchResultProps) {
  const searchParams = useSearchParams();

  const keywordFromQuery = searchParams.get("keyword") || "";

  return (
    <div className="w-full mx-auto mt-4">
      <h3 className="text-xl font-light mb-6">
        <span className="font-bold">&quot;{keywordFromQuery}&quot;</span>의 관련
        콘텐츠
        <span className="font-bold">10개</span>가 검색 되었어요.
      </h3>
      <div className="flex items-center gap-4 mb-8 justify-end">
        <select
          id="type"
          value={type}
          onChange={onTypeChange}
          className="max-w-[200px] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        >
          <option value="all">전체</option>
          <option value="movie">영화</option>
          <option value="actor">배우</option>
          <option value="director">감독</option>
        </select>
      </div>
      <MovieCardList />
      {/* 검색 결과가 없을 때 MovieCardList와 조건부 렌더링 추가 */}
      {/* <div className="text-center text-xl text-gray-300 p-32 flex flex-col items-center justify-center">
        <BsFillCloudRainFill className="text-6xl mb-4" />
        <span>검색 결과가 없습니다 :(</span>
      </div> */}
    </div>
  );
}
