const NoPoster = ({ className = "" }: { className?: string }) => (
  <div
    className={`w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 rounded-[20px] text-lg ${className}`}
  >
    이미지 없음
  </div>
);

export default NoPoster;
