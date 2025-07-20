import Image from "next/image";
import { twMerge } from "tailwind-merge";

interface PosterCardProps {
  imageUrl: string;
  name: string;
  className?: string;
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
}: PosterCardProps) {
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
      <div className="absolute inset-0 bg-black/60 flex items-end justify-start opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="text-white text-lg font-bold px-4 py-6">{name}</span>
      </div>
    </div>
  );
}
