'use client';

import SavedMoviesList from './components/SavedMoviesList';
import ReviewSummary from './components/ReviewSummary';
import ProfileCard from './components/ProfileCard';
import CalendarSection from './components/CalendarSection';
import CustomCalendarSection from './components/CustomCalendarSection';
import { FaBookmark } from "react-icons/fa";

export default function MyPage() {
  return (
    <div className="flex justify-center py-12 px-4 bg-[#1D1F28] min-h-screen">
      <div className="max-w-[1277px] w-full flex flex-col">
        {/* 프로필 카드 */}
        <div className="mb-[32px]">
          <ProfileCard
            userName="User Name"
            email="user@email.com"
            profileImageUrl="/assets/icons/profile.svg"
          />
        </div>

        {/* 캘린더 + 오른쪽 섹션 */}
        <div className="flex gap-[187px] items-end">

          {/* 왼쪽: 캘린더 전체 */}
          <div className="flex flex-col flex-shrink-0">
            <div className="text-white text-[24px] font-medium">캘린더</div>
            <CustomCalendarSection />
          </div>

          {/* 오른쪽: 한줄평 전체 */}
          <div className="flex flex-col flex-1 items-start">
            <ReviewSummary />
            <div className="mt-16">
              <SavedMoviesList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
 
