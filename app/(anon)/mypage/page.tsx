"use client";

import SavedMoviesList from "./components/SavedMoviesList";
import ReviewSummary from "./components/ReviewSummary";
import ProfileCard from "./components/ProfileCard";
import CustomCalendar from "./components/CustomCalendar";

export default function MyPage() {
  return (
    <div className="flex justify-center w-full max-w-7xl m-auto text-white">
      <div className="w-full flex flex-col gap-10">
        {/* 프로필 카드 */}
        <div className="mb-[32px]">
          <ProfileCard
            userName="User Name"
            email="user@email.com"
            profileImageUrl="/assets/icons/profile.svg"
          />
        </div>

        {/* 캘린더 + 오른쪽 섹션 */}
        <div className="flex justify-between">
          {/* 왼쪽: 캘린더 전체 */}
          <div className="flex flex-col flex-shrink-0">
            <CustomCalendar />
          </div>

          {/* 오른쪽: 한줄평 전체 */}
          <div className="flex flex-col gap-10">
            <ReviewSummary />
            <SavedMoviesList />
          </div>
        </div>
      </div>
    </div>
  );
}
