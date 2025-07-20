import PosterCard from "@/app/components/PosterCard";

interface ClickablePosterCardProps {
  imageUrl: string;
  name: string;
  className?: string;
  onClick: () => void;
}

/**
 * 클릭 가능한 포스터 카드 래퍼 컴포넌트
 * 기존 PosterCard를 감싸고 클릭 이벤트를 처리합니다.
 */
export default function ClickablePosterCard({
  imageUrl,
  name,
  className,
  onClick,
}: ClickablePosterCardProps) {
  return (
    <div onClick={onClick} className="cursor-pointer w-full h-full">
      <PosterCard imageUrl={imageUrl} name={name} className={className} />
    </div>
  );
}
