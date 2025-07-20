import React, { useState } from "react";
import { useParams } from "next/navigation";
import Modal from "@/app/components/Modal";
import MoviePreviewInfo from "./MoviePreviewInfo";
import MovieReviewList from "./MovieReviewList";
import type {
  MoviePreviewDto,
  MovieDetailDto,
} from "@/backend/application/movies/dtos/MovieDetailDto";

interface ModalProps {
  setModal: () => void;
  movieId?: number;
}

const MovieDetailModal = ({ setModal, movieId: propMovieId }: ModalProps) => {
  const params = useParams();

  // URL에서 movieId 파싱
  const urlMovieId = params?.id ? Number(params.id) : null;
  const movieId = propMovieId || urlMovieId || 550; // Fight Club (실제 TMDB 영화 ID)

  // 접힘 상태에서는 preview만 사용
  const [moviePreview, setMoviePreview] = useState<MoviePreviewDto | null>(
    null
  );
  // 펼침 상태에서만 detail 사용
  const [movieDetail, setMovieDetail] = useState<MovieDetailDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState("");

  // 초기 preview 데이터 로드
  React.useEffect(() => {
    const fetchMoviePreview = async () => {
      setLoading(true);
      setError("");
      try {
        console.log("Fetching movie preview for ID:", movieId);
        const res = await fetch(`/api/movies/${movieId}`);
        console.log("Response status:", res.status);

        if (!res.ok) {
          const errorText = await res.text();
          console.error("API Error:", errorText);
          throw new Error("영화 정보를 불러올 수 없습니다.");
        }

        const data = await res.json();
        console.log("Received movie data:", data);

        // API에서 받은 데이터를 preview 형태로 변환
        const preview: MoviePreviewDto = {
          id: data.id,
          title: data.title,
          poster_path: data.poster_path,
          ott_providers: data.ott?.ott_providers || [],
          release_date: data.release_date,
          rating: data.certification?.certification || "등급 정보 없음",
          genres: data.genres?.map((g: { name: string }) => g.name) || [],
          country: data.country || "미국",
          runtime: data.runtime ? `${data.runtime}분` : "러닝타임 정보 없음",
        };

        console.log("Converted preview data:", preview);
        setMoviePreview(preview);
      } catch (e) {
        console.error("Error fetching movie preview:", e);
        setError(e instanceof Error ? e.message : "에러가 발생했습니다.");
        setMoviePreview(null);
      } finally {
        setLoading(false);
      }
    };
    fetchMoviePreview();
  }, [movieId]);

  // 상세 정보 펼치기 클릭 시 상세정보 요청
  const handleOpenDetail = async () => {
    if (!movieDetail) {
      setDetailLoading(true);
      try {
        console.log("Fetching movie detail for ID:", movieId);
        const res = await fetch(`/api/movies/${movieId}`);
        if (!res.ok) throw new Error("상세 정보를 불러올 수 없습니다.");
        const data = await res.json();
        console.log("Received detail data:", data);
        setMovieDetail(data);
      } catch (e) {
        console.error("Error fetching movie detail:", e);
        setError(
          e instanceof Error
            ? e.message
            : "상세 정보 로드 중 에러가 발생했습니다."
        );
      } finally {
        setDetailLoading(false);
      }
    }
  };

  return (
    <Modal setModal={setModal}>
      {loading && <div className="p-8 text-center">로딩중...</div>}
      {error && !loading && (
        <div className="p-8 text-center text-red-400">{error}</div>
      )}
      {!loading && moviePreview && (
        <>
          <MoviePreviewInfo
            info={moviePreview}
            onOpenDetail={handleOpenDetail}
            detail={movieDetail}
            detailLoading={detailLoading}
          />
          <MovieReviewList />
        </>
      )}
    </Modal>
  );
};

export default MovieDetailModal;
