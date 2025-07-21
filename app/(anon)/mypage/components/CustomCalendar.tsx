import React, { useState } from "react";
import Image from "next/image";
import { useCalendarMovies } from "../hooks/useCalendarMovies";
import { CalendarMovieDto } from "@/backend/application/saves/dtos/CalendarDto";

const daysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const CustomCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // useCalendarMovies 훅 사용
  const { movies, error } = useCalendarMovies({
    year: currentDate.getFullYear(),
    month: currentDate.getMonth() + 1, // getMonth()는 0-11을 반환하므로 +1
  });

  // 날짜별로 영화를 찾는 함수 (하나만)
  const getMovieByDate = (dateStr: string): CalendarMovieDto | undefined => {
    // ISO 날짜를 YYYY-MM-DD 형식으로 변환하여 비교
    const movie = movies.find((movie) => {
      const movieDate = movie.savedAt.split("T")[0]; // ISO 날짜에서 날짜 부분만 추출
      return movieDate === dateStr;
    });

    return movie;
  };

  // 날짜 셀 렌더링
  const renderDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const days = daysInMonth(year, month);
    const firstDay = new Date(year, month, 1).getDay();
    const cells = [];

    // 빈 셀들 (월의 첫 번째 날 이전)
    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={"empty-" + i} />);
    }

    // 날짜 셀들
    for (let d = 1; d <= days; d++) {
      // UTC 시간으로 날짜 생성하여 타임존 문제 해결
      const dateStr = new Date(Date.UTC(year, month, d))
        .toISOString()
        .split("T")[0];
      const movie = getMovieByDate(dateStr);

      cells.push(
        <div
          key={dateStr}
          className="flex flex-col rounded-md p-1 h-[120px] w-[80px] bg-white relative"
        >
          <span className="text-gray-700 text-sm absolute left-1 top-1">
            {d}
          </span>

          {/* 영화 포스터 */}
          {movie && (
            <div className="mt-5 flex justify-center">
              <Image
                src={movie.posterUrl}
                alt={movie.title}
                width={100}
                height={100}
                className="w-17 h-24 object-cover bg-slate-200 rounded shadow"
              />
            </div>
          )}
        </div>
      );
    }

    return cells;
  };

  // 월 이동
  const handlePrevMonth = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  };

  return (
    <>
      <div className="text-xl font-medium mb-4">캘린더</div>

      {/* 로딩 상태 */}
      {/* {isLoading && (
        <div className="text-center py-4 text-gray-600">
          캘린더 데이터를 불러오는 중...
        </div>
      )} */}

      <div className="flex flex-col min-h-[832px] w-[631px] bg-[#17181D] rounded-xl">
        <div className="bg-white rounded-xl px-6 py-10 w-full h-full">
          {/* 캘린더 헤더 */}
          <div className="flex items-center justify-between mb-20">
            <button
              onClick={handlePrevMonth}
              className="text-[#23242b] text-xl font-bold"
            >
              ◀
            </button>
            <span className="text-xl font-semibold text-gray-800">
              {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
            </span>
            <button
              onClick={handleNextMonth}
              className="text-[#23242b] text-xl font-bold"
            >
              ▶
            </button>
          </div>

          {/* 캘린더 날짜 그리드 */}
          <div className="grid grid-cols-7 gap-2">{renderDays()}</div>
          {/* 에러 상태 */}
          {error && (
            <div className="text-center py-4 text-red-600">{error}</div>
          )}
        </div>
      </div>
    </>
  );
};

export default CustomCalendar;
