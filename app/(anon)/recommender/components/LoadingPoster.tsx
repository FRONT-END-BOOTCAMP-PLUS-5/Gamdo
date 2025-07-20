import React from "react";

interface LoadingPosterProps {
  className?: string;
}

const LoadingPoster: React.FC<LoadingPosterProps> = ({ className = "" }) => {
  return (
    <div
      className={`bg-gray-800 rounded-lg flex flex-col items-center justify-center w-full h-full ${className}`}
    >
      {/* 로딩 스피너 */}
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>

      {/* 로딩 텍스트 */}
      <div className="text-white text-sm font-medium text-center">
        이미지 로딩중...
      </div>

      {/* 추가 로딩 효과 */}
      <div className="mt-2 flex space-x-1">
        <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
        <div
          className="w-2 h-2 bg-white rounded-full animate-bounce"
          style={{ animationDelay: "0.1s" }}
        ></div>
        <div
          className="w-2 h-2 bg-white rounded-full animate-bounce"
          style={{ animationDelay: "0.2s" }}
        ></div>
      </div>
    </div>
  );
};

export default LoadingPoster;
