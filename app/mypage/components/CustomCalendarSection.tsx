import React, { useState, useEffect, useRef } from 'react';

interface CalendarImageEvent {
  id: string;
  date: string; // YYYY-MM-DD
  imageUrl: string;
}

const daysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const CustomCalendarSection: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarImageEvent[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // API 연동 없이 프론트에서만 임시로 동작
  useEffect(() => {
    // 필요시 events 초기화
    // setEvents([]);
  }, [currentDate]);

  // 이미지 업로드 핸들러 (프론트에서만 동작)
  const handleImageUpload = async (date: string, file: File) => {
    setUploading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      setEvents((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).slice(2),
          date,
          imageUrl: e.target?.result as string,
        },
      ]);
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  // 날짜 셀 렌더링 (디자인/레이아웃 그대로)
  const renderDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const days = daysInMonth(year, month);
    const firstDay = new Date(year, month, 1).getDay();
    const cells = [];
    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={'empty-' + i} />);
    }
    for (let d = 1; d <= days; d++) {
      const dateStr = new Date(year, month, d).toISOString().split('T')[0];
      const dayEvent = events.find((e) => e.date === dateStr);
      cells.push(
        <div
          key={dateStr}
          className="flex flex-col rounded-md p-1 h-[100px] w-[80px] bg-white relative group cursor-pointer"
          onClick={() => {
            setSelectedDate(dateStr);
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
              fileInputRef.current.click();
            }
          }}
        >
          <span className="text-gray-700 text-sm absolute left-1 top-1">{d}</span>
          {dayEvent && (
            <img
              src={dayEvent.imageUrl}
              alt="event"
              className="w-12 h-16 object-cover rounded shadow mx-auto mt-4"
            />
          )}
        </div>
      );
    }
    return cells;
  };

  // 파일 선택 시 업로드 트리거
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedDate && e.target.files && e.target.files[0]) {
      handleImageUpload(selectedDate, e.target.files[0]);
    }
  };

  // 월 이동
  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };
  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  return (
    <div className="flex flex-col min-h-[880px] w-[631px] bg-[#23242b] py-8 px-4 rounded-xl">
      <div className="bg-white rounded-3xl shadow-2xl p-6 pb-10 w-full h-full">
        {/* 캘린더 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={handlePrevMonth} className="text-[#23242b] text-xl font-bold">◀</button>
          <span className="text-xl font-semibold text-gray-800">{currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월</span>
          <button onClick={handleNextMonth} className="text-[#23242b] text-xl font-bold">▶</button>
        </div>
        {/* 캘린더 날짜 그리드 */}
        <div className="grid grid-cols-7 gap-2">
          {renderDays()}
        </div>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
          disabled={uploading}
        />
      </div>
    </div>
  );
};

export default CustomCalendarSection; 