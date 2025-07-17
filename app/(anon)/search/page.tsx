"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import SearchInput from "./components/SearchInput";
import SearchResult from "./components/SearchResult";
import RecommendedMovieList from "./components/RecommendedMovieList";

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const keywordFromQuery = searchParams.get("keyword") || "";
  const type = searchParams.get("type") || "all";

  // input의 상태는 로컬에서만 관리
  const [inputValue, setInputValue] = useState(keywordFromQuery);

  // 쿼리스트링이 바뀌면 inputValue도 동기화 (뒤로가기 등 대응)
  useEffect(() => {
    setInputValue(keywordFromQuery);
  }, [keywordFromQuery]);

  // input 변경 핸들러 (로컬 상태만 변경)
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
    },
    []
  );

  // 검색 실행 핸들러 (엔터/버튼)
  const handleSearch = useCallback(() => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set("keyword", inputValue);
    router.replace(`?${params.toString()}`);
  }, [inputValue, router, searchParams]);

  // type select 핸들러 (type만 쿼리스트링에 반영)
  const handleTypeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newType = e.target.value;
      const params = new URLSearchParams(Array.from(searchParams.entries()));
      params.set("type", newType);
      router.replace(`?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <section className="flex justify-center w-full max-w-7xl m-auto text-white">
      <div className="flex flex-col items-center justify-center w-full gap-8">
        <SearchInput
          value={inputValue}
          onChange={handleInputChange}
          onSearch={handleSearch}
        />
        {keywordFromQuery ? (
          <SearchResult type={type} onTypeChange={handleTypeChange} />
        ) : (
          <RecommendedMovieList />
        )}
      </div>
    </section>
  );
}
