export const PosterCardSkeleton = ({ className }: { className?: string }) => {
  return (
    <div
      role="status"
      className={`max-w-sm p-4 border bg-gray-300 rounded-[20px] shadow-sm animate-pulse md:p-6 aspect-[308/457] ${className}`}
    ></div>
  );
};
