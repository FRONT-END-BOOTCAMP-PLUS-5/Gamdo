import React, { useState } from "react";
import Image from "next/image";
import MovieDetailActions from "./MovieHeader";
import { RiArrowDownSFill, RiArrowUpSFill } from "react-icons/ri";

const labels = ["개봉", "등급", "장르", "국가", "러닝타임"];

const director = {
  name: "브래드 피트",
  image: "/assets/images/test_image_01.png",
};
const actors = [
  { name: "브래드 피트", image: "/assets/images/test_image_01.png" },
  { name: "Damson Idris", image: "/assets/images/test_image_02.png" },
];
const description =
  "한때 주목받는 유망주였지만 끔찍한 사고로 F1에서 우승하지 못하고 한순간에 추락한 드라이버 소니 헤이스. 그의 오랜 동료인 루벤 세르반테스에게 레이싱 복귀를 제안받으며 최하위 팀인 APXGP에 합류한다. 그러나 팀 내 떠오르는 천재 드라이버 조슈아 피어스와 소니 헤이스의 갈등은 날이 갈수록 심해지고, 설상가상 우승을 향한 APXGP 팀의 전략 또한 번번이 실패하며 최하위권을 벗어나지 못하고 고전하는데...";

type MovieDetailInfoProps = {
  info: {
    releaseDate: string;
    rating: string;
    genre: string;
    country: string;
    runningTime: string;
  };
};

const MoviePreviewInfo = ({ info }: MovieDetailInfoProps) => {
  const [open, setOpen] = useState(false);
  const defaultInfo = {
    releaseDate: "2025.06.25",
    rating: "12세 이상 관람가",
    genre: "드라마, 액션",
    country: "미국",
    runningTime: "155분",
  };
  const safeInfo = { ...defaultInfo, ...info };
  return (
    <>
      {/* 상단 이미지와 닫기 버튼 등 */}
      <div className="relative w-full h-[450px] max-h-[70vh] bg-black ">
        <Image
          src="/assets/images/test_image_01.png"
          alt="movie poster"
          fill
          className="object-cover w-full h-full rounded-tl-2xl rounded-tr-2xl"
          priority
        />
        {/* 닫기 버튼은 Modal에서 처리 */}
      </div>
      {/* 플랫폼, 액션 버튼, 영화 정보 */}
      <div className="flex gap-2 px-6 py-3 items-center">
        <MovieDetailActions />
      </div>
      <div className="p-6">
        <div className="text-3xl font-bold text-white mb-6 mt-2">
          F1 더 무비
        </div>
        {/* 스타일 통일용 래퍼 div */}
        <div
          className="rounded-xl p-12 pb-5"
          style={{ backgroundColor: "rgb(22, 18, 20)" }}
        >
          {/* 5개 정보 grid */}
          <div className="grid grid-cols-2 gap-x-2 gap-y-3 text-base text-gray-300">
            {labels.map((label, idx) => (
              <React.Fragment key={label}>
                <div className="text-sm text-gray-400 font-medium">{label}</div>
                <div className="text-base text-white font-normal">
                  {Object.values(safeInfo)[idx]}
                </div>
              </React.Fragment>
            ))}
          </div>
          {/* ▼ 버튼 */}
          {!open && (
            <button
              className="mx-auto block mt-6 cursor-pointer"
              onClick={() => setOpen(true)}
            >
              <RiArrowDownSFill size={32} />
            </button>
          )}
          {/* 상세 정보 */}
          {open && (
            <div className="mt-8">
              {/* 소개 */}
              <div className="mb-6">
                <div className="text-lg font-semibold text-white mb-2">
                  소개
                </div>
                <div className="text-gray-200 text-base leading-relaxed whitespace-pre-line">
                  {description}
                </div>
              </div>
              {/* 감독 */}
              <div className="mb-6">
                <div className="text-lg font-semibold text-white mb-2">
                  감독
                </div>
                <div className="flex items-center gap-4">
                  <Image
                    src={director.image}
                    alt={director.name}
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <span className="text-base text-white font-medium">
                    {director.name}
                  </span>
                </div>
              </div>
              {/* 주연 */}
              <div className="mb-6">
                <div className="text-lg font-semibold text-white mb-2">
                  주연
                </div>
                <div className="flex items-center gap-4">
                  {actors.map((actor) => (
                    <div
                      key={actor.name}
                      className="flex flex-col items-center"
                    >
                      <Image
                        src={actor.image}
                        alt={actor.name}
                        width={64}
                        height={64}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <span className="text-base text-white font-medium mt-2">
                        {actor.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              {/* 접기 버튼 */}
              <button
                className="flex items-center mt-2 text-gray-400 cursor-pointer hover:text-white mx-auto"
                onClick={() => setOpen(false)}
              >
                <RiArrowUpSFill size={32} />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MoviePreviewInfo;
