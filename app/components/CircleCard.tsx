import Image from "next/image";
import Link from "next/link";

interface CircleCardProps {
  imageUrl: string;
  name: string;
}

/**
 * 원형 카드 컴포넌트
 * 배우, 감독 등 원형 이미지를 사용하는 카드
 * MovieCardList컴포넌트를 보면 어떻게 사용하는지 확인할 수 있습니다.
 */

export default function CircleCard({ imageUrl, name }: CircleCardProps) {
  return (
    <div className="relative overflow-hidden rounded-full transition-transform duration-300 group cursor-pointer hover:scale-110 aspect-[1/1] bg-gray-800">
      <Link href={`/search/artist?name=${name}`}>
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-contain object-top rounded-full"
          sizes="(max-width: 768px) 100vw, 308px"
        />
        {/* Hover 시 배우 이름 표시 */}
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full">
          <span className="text-white text-sm font-bold text-center px-2">
            {name}
          </span>
        </div>
      </Link>
    </div>
  );
}
