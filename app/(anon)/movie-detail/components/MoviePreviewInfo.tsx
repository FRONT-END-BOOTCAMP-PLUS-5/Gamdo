import React, { useState } from "react";
import Image from "next/image";
import MovieDetailActions from "./MovieHeader";
import type {
  MoviePreviewDto,
  MovieDetailDto,
} from "@/backend/application/movies/dtos/MovieDetailDto";

const labels = ["개봉", "등급", "장르", "국가", "러닝타임"];

type MoviePreviewInfoProps = {
  info: MoviePreviewDto;
  onOpenDetail: () => void;
  detail?: MovieDetailDto | null;
  detailLoading?: boolean;
};

const MoviePreviewInfo = ({
  info,
  onOpenDetail,
  detail,
  detailLoading = false,
}: MoviePreviewInfoProps) => {
  const [expanded, setExpanded] = useState(false);

  // TMDB 이미지 기본 URL
  const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w342";

  // 접힘 상태에서 보여줄 기본 정보
  const previewInfo = {
    releaseDate: info.release_date,
    rating: info.rating,
    genre: info.genres.join(", "),
    country: info.country,
    runningTime: info.runtime,
  };

  // 펼침 상태에서 보여줄 상세 정보
  const detailInfo = detail
    ? {
        overview: detail.overview,
        director: detail.credits?.director,
        mainCast: detail.credits?.main_cast || [],
      }
    : null;

  // 포스터 이미지 URL 생성
  const posterUrl = info.poster_path
    ? `${TMDB_IMAGE_BASE_URL}${info.poster_path}`
    : "/assets/images/test_image_01.png";

  return (
    <>
      {/* 상단 이미지와 닫기 버튼 등 */}
      <div className="relative w-full h-[500px] max-h-[70vh] bg-black ">
        <Image
          src={posterUrl}
          alt="movie poster"
          fill
          className="object-cover w-full h-full rounded-tl-2xl rounded-tr-2xl"
          priority
        />
        {/* 닫기 버튼은 Modal에서 처리 */}
      </div>
      {/* 플랫폼, 액션 버튼, 영화 정보 */}
      <div className="flex gap-2 px-6 py-3 items-center">
        <MovieDetailActions ottProviders={info.ott_providers} />
      </div>
      <div className="p-6">
        <div className="text-3xl font-bold text-white mb-6 mt-2 text-left">
          {info.title}
        </div>
        {/* 스타일 통일용 래퍼 div */}
        <div
          className={`rounded-xl p-12 pb-5 text-left transition-colors duration-150 ${
            !expanded ? "cursor-pointer hover:bg-[#303b51]" : ""
          }`}
          style={{ backgroundColor: "rgb(22, 18, 20)" }}
          onClick={() => {
            if (!expanded) {
              setExpanded(true);
              onOpenDetail();
            }
          }}
        >
          {/* 5개 정보 grid */}
          <div className="grid grid-cols-2 gap-x-2 gap-y-3 text-base text-gray-300 text-left">
            {labels.map((label, idx) => (
              <React.Fragment key={label}>
                <div className="text-sm text-gray-400 font-medium text-left">
                  {label}
                </div>
                <div className="text-base text-white font-normal text-left">
                  {Object.values(previewInfo)[idx]}
                </div>
              </React.Fragment>
            ))}
          </div>
          {/* 상세 정보 */}
          {expanded && (
            <div className="mt-8 text-left">
              {detailLoading ? (
                <div className="text-center text-gray-400">
                  상세 정보 로딩중...
                </div>
              ) : detailInfo ? (
                <>
                  {/* 소개 */}
                  {detailInfo.overview && (
                    <div className="mb-6">
                      <div className="text-lg font-semibold text-white mb-2 text-left">
                        소개
                      </div>
                      <div className="text-gray-200 text-base leading-relaxed whitespace-pre-line text-left">
                        {detailInfo.overview}
                      </div>
                    </div>
                  )}
                  {/* 감독 */}
                  {detailInfo.director && (
                    <div className="mb-6">
                      <div className="text-lg font-semibold text-white mb-2 text-left">
                        감독
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center">
                          <Image
                            src={
                              detailInfo.director.profile_path
                                ? `${TMDB_IMAGE_BASE_URL}${detailInfo.director.profile_path}`
                                : "/assets/images/test_image_01.png"
                            }
                            alt={detailInfo.director.name}
                            width={64}
                            height={64}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                          <span className="text-base text-white font-medium mt-2 text-left">
                            {detailInfo.director.name}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* 주연 */}
                  {detailInfo.mainCast.length > 0 && (
                    <div className="mb-6">
                      <div className="text-lg font-semibold text-white mb-2 text-left">
                        주연
                      </div>
                      <div className="flex items-center gap-4">
                        {detailInfo.mainCast.map((actor) => (
                          <div
                            key={actor.id}
                            className="flex flex-col items-center"
                          >
                            <Image
                              src={
                                actor.profile_path
                                  ? `${TMDB_IMAGE_BASE_URL}${actor.profile_path}`
                                  : "/assets/images/test_image_01.png"
                              }
                              alt={actor.name}
                              width={64}
                              height={64}
                              className="w-16 h-16 rounded-full object-cover"
                            />
                            <span className="text-base text-white font-medium mt-2 text-left">
                              {actor.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center text-gray-400">
                  상세 정보를 불러올 수 없습니다.
                </div>
              )}
              {/* 접기 버튼 */}
              <button
                className="block mx-auto mt-2 text-xs text-gray-400 hover:text-white cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setExpanded(false);
                }}
              >
                상세정보 접기
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MoviePreviewInfo;
