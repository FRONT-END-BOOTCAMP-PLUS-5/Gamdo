"use client";

import { useState, useEffect } from "react";
import axios from "@/utils/axios";
import { DayPicker, getDefaultClassNames } from "react-day-picker";

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
  const defaultClassNames = getDefaultClassNames();
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

  return (
    <div className="absolute top-14 right-0 z-1 mt-2">
      <DayPicker
        mode="single"
        classNames={{
          today: `border-cyan-300`,
          selected: `bg-cyan-300 border-amber-500 text-white`,
          root: `${defaultClassNames.root} shadow-lg bg-slate-500 rounded-lg p-5`,
          chevron: `${defaultClassNames.chevron} fill-cyan-300`,
        }}
      />
    </div>
  );
}
