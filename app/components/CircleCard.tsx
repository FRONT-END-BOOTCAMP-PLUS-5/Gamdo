import Image from "next/image";

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
    <div className="relative overflow-hidden rounded-full transition-transform duration-300 group cursor-pointer hover:scale-110 aspect-[1/1]">
      <Image
        src={imageUrl}
        alt={name}
        fill
        className="object-cover rounded-full"
        sizes="(max-width: 768px) 100vw, 308px"
      />
    </div>
  );
}
