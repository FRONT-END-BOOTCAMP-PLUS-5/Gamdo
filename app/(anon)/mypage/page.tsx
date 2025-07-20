"use client";

import SavedMoviesList from "./components/SavedMoviesList";
import ReviewSummary from "./components/ReviewSummary";
import ProfileCard from "./components/ProfileCard";
import CustomCalendarSection from "./components/CustomCalendarSection";

export default function MyPage() {
  return (
    <div className="flex justify-center w-full max-w-7xl m-auto text-white">
      <div className="w-full flex flex-col gap-10">
        <div className="mb-[32px]">
          <ProfileCard />
        </div>

        <div className="flex justify-between">
          <div className="flex flex-col flex-shrink-0">
            <CustomCalendarSection />
          </div>

          <div className="flex flex-col gap-10">
            <ReviewSummary />
            <SavedMoviesList />
          </div>
        </div>
      </div>
    </div>
  );
}
