import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { getPlatformImages } from "./Platform";
import { handlePlatformClick as navigateToPlatform } from "@/utils/ott/ottNavigation";

interface PosterCardProps {
  imageUrl: string;
  name: string;
  className?: string;
  ottProviders?: string[];
}

/**
 * 포스터 카드 컴포넌트
 * 영화, 드라마 등 포스터 이미지를 사용하는 카드
 * 부모 컴포넌트에 grid grid-cols-4 gap-6 items-center 같은 그리드 속성 추가해서 사용">
 * MovieCardList컴포넌트를 보면 어떻게 사용하는지 확인할 수 있습니다.
 */

export default function PosterCard({
  imageUrl,
  name,
  className,
  ottProviders = [],
}: PosterCardProps) {
  // OTT 제공자 이미지 경로 배열 가져오기
  const platformImages = getPlatformImages(ottProviders);
  const uniquePlatformImages = Array.from(new Set(platformImages));

  // 플랫폼 클릭 핸들러
  const handlePlatformClick = (e: React.MouseEvent, imagePath: string) => {
    e.stopPropagation(); // 카드 클릭 이벤트 방지
    navigateToPlatform(imagePath, name);
  };

  return (
    <div
      className={twMerge(
        "relative overflow-hidden rounded-[20px] transition-transform duration-300 group cursor-pointer hover:scale-110 aspect-[308/457] bg-slate-800",
        className
      )}
    >
      <Image
        src={imageUrl}
        alt={name}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 308px"
      />

      {/* OTT 플랫폼 아이콘들 */}
      {uniquePlatformImages.length > 0 && (
        <div className="absolute top-2 right-2 flex gap-1">
          {uniquePlatformImages.slice(0, 3).map((imagePath, index) => (
            <Image
              key={index}
              src={imagePath}
              alt={`platform-${index}`}
              width={20}
              height={20}
              className="w-5 h-5 rounded cursor-pointer hover:opacity-80 transition-opacity"
              onClick={(e) => handlePlatformClick(e, imagePath)}
            />
          ))}
        </div>
      )}

      <div className="absolute inset-0 bg-black/60 flex items-end justify-start opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="text-white text-lg font-bold px-4 py-6">{name}</span>
      </div>
    </div>
  );
}
