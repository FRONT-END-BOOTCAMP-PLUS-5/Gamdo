"use client";

import { useState, useEffect } from "react";
import axios from "@/utils/axios";
import Datepicker from "tailwind-datepicker-react";

interface MovieHeaderCalendarProps {
  isOpen: boolean;
  onDateSelect?: (date: Date) => void;
  movieId?: string;
}

interface SaveDateInfo {
  date: string;
  movieId: string;
}

export default function MovieHeaderCalendar({
  isOpen,
  onDateSelect,
  movieId,
}: MovieHeaderCalendarProps) {
  const [savedDates, setSavedDates] = useState<SaveDateInfo[]>([]);

  // 캘린더가 열릴 때 해당 영화의 저장된 날짜 목록 가져오기
  useEffect(() => {
    if (isOpen && movieId) {
      fetchSavedDates(movieId);
    }
  }, [isOpen, movieId]);

  const fetchSavedDates = async (movieId: string) => {
    try {
      const response = await axios.get(`/movies/calenders?movieId=${movieId}`);
      setSavedDates(response.data);
    } catch (error) {
      console.error("Error fetching saved dates:", error);
    }
  };

  const handleDateChange = (selectedDate: Date) => {
    if (onDateSelect) {
      onDateSelect(selectedDate);
    }
  };

  if (!isOpen) return null;

  const options = {
    autoHide: false,
    todayBtn: false,
    clearBtn: false,
    maxDate: new Date("2030.01.01"),
    minDate: new Date("2020.01.01"),
    theme: {
      background: "bg-slate-200 w-[250px] absolute top-0 right-0",
      todayBtn: "",
      clearBtn: "",
      icons: "",
      text: "text-slate-900",
      disabledText: "text-gray-400",
      input: "w-0 h-0 opacity-0",
      inputIcon: "",
      selected: "bg-red-300 text-slate-900 hover:bg-red-300",
    },
    icons: {
      prev: () => <span>‹</span>,
      next: () => <span>›</span>,
    },
    datepickerClassNames: "top-15 right-0",
    defaultDate:
      savedDates.length > 0 ? new Date(savedDates[0].date) : undefined,

    weekDays: ["일", "월", "화", "수", "목", "금", "토"],
  };

  return (
    <div className="absolute top-0 right-0 z-0 mt-2">
      <Datepicker
        options={options}
        onChange={handleDateChange}
        show={isOpen}
        setShow={() => {}} // 빈 함수로 설정하여 내부 상태 변경 방지
      />
    </div>
  );
}
