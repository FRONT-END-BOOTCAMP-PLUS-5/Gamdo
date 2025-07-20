"use client";

import { useEffect } from "react";
import axios from "@/utils/axios";
import { DayPicker, getDefaultClassNames } from "react-day-picker";

interface MovieHeaderCalendarProps {
  isOpen: boolean;
  onDateSelect?: (date: Date) => void;
  movieId?: string;
  savedDate?: Date;
  onSavedDateChange?: (date: Date | undefined) => void;
}

export default function MovieHeaderCalendar({
  isOpen,
  onDateSelect,
  movieId,
  savedDate,
  onSavedDateChange,
}: MovieHeaderCalendarProps) {
  const defaultClassNames = getDefaultClassNames();

  // 캘린더가 열릴 때 해당 영화의 저장된 날짜 가져오기
  useEffect(() => {
    if (isOpen && movieId) {
      fetchSavedDate(movieId);
    }
  }, [isOpen, movieId]);

  const fetchSavedDate = async (movieId: string) => {
    try {
      const response = await axios.get(`/movies/calenders?movieId=${movieId}`);

      // 저장된 날짜가 있으면 해당 날짜를 설정
      if (response.data && response.data.length > 0) {
        const savedDateObj = new Date(response.data[0].date);
        onSavedDateChange?.(savedDateObj);
      } else {
        onSavedDateChange?.(undefined);
      }
    } catch (error) {
      console.error("Error fetching saved date:", error);
      onSavedDateChange?.(undefined);
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      // UTC 시간으로 날짜 생성하여 타임존 문제 완전 해결
      const year = date.getFullYear();
      const month = date.getMonth(); // 0-based
      const day = date.getDate();

      // UTC 시간으로 Date 객체 생성 (로컬 시간대 무시)
      const utcDate = new Date(Date.UTC(year, month, day));

      onSavedDateChange?.(utcDate);
      if (onDateSelect) {
        onDateSelect(utcDate);
      }
    } else {
      onSavedDateChange?.(undefined);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-14 right-0 z-1 mt-2">
      <DayPicker
        mode="single"
        selected={savedDate}
        onSelect={handleDateChange}
        modifiers={{
          saved: savedDate ? [savedDate] : [],
        }}
        modifiersStyles={{
          saved: {
            backgroundColor: "#56ebe1",
            color: "black",
            fontWeight: "bold",
            borderRadius: "2rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
        }}
        classNames={{
          selected: ``,
          root: `${defaultClassNames.root} shadow-lg bg-slate-500 rounded-lg p-5`,
          chevron: `${defaultClassNames.chevron} fill-cyan-300`,
          day: `${defaultClassNames.day} p-2`,
        }}
      />
    </div>
  );
}
