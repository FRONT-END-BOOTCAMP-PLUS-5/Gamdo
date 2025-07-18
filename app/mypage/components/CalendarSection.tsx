            'use client';

import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

interface MovieEvent {
  id: string;
  date: string;
  title: string;
  poster: string;
}

interface CalendarSectionProps {
  events: MovieEvent[];
  onRemoveEvent: (id: string) => void;
}

const CalendarSection: React.FC<CalendarSectionProps> = ({ events, onRemoveEvent }) => {
  const [value, setValue] = useState<Date>(new Date());

  const eventsByDate = events.reduce((acc, event) => {
    acc[event.date] = acc[event.date] || [];
    acc[event.date].push(event);
    return acc;
  }, {} as Record<string, MovieEvent[]>);

  const tileContent = ({ date }: { date: Date }) => {
    const dateStr = date.toISOString().split('T')[0];
    const dayEvents = eventsByDate[dateStr] || [];
    return (
      <div className="flex flex-col items-center justify-center mt-1">
        {dayEvents.map((event) => (
          <img
            key={event.id}
            src={event.poster}
            alt={event.title}
            className="w-16 h-20 object-cover rounded-md shadow-md mt-1 cursor-pointer border border-gray-200"
            onContextMenu={(e) => {
              e.preventDefault();
              onRemoveEvent(event.id);
            }}
            title="우클릭 시 삭제"
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-[80px] w-[631px] bg-[#23242b] py-8 px-4 rounded-xl">
      <div className="bg-white rounded-3xl shadow-2xl p-6 pb-10 border-4 border-blue-400 w-full h-full">
        <Calendar
          value={value}
          onChange={(val) => val instanceof Date && setValue(val)}
          tileContent={tileContent}
          calendarType="gregory"
          formatDay={(_, date) => date.getDate().toString()}
          locale="ko-KR"
          className="custom-calendar"
        />
      </div>
      <style jsx global>{`
        .custom-calendar {
          width: 100% !important;
          height: 100% !important;
          border-radius: 1.5rem !important;
          background: white !important;
          box-shadow: none !important;
          border: none !important;
        }
        .custom-calendar .react-calendar__tile {
          height: 120px !important;
        }
      `}</style>
    </div>
  );
};

export default CalendarSection;

