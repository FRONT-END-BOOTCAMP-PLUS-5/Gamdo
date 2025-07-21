import React, { useState, useEffect } from "react";
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

const MovieDetailModal = ({ setModal, movieId = 550 }: ModalProps) => {
  // 접힘 상태에서는 preview만 사용
  const [moviePreview, setMoviePreview] = useState<MoviePreviewDto | null>(
    null
  );
  // 항상 detail 사용
  const [movieDetail, setMovieDetail] = useState<MovieDetailDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMovieDetail = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/movies/${movieId}`);
        if (!res.ok) throw new Error("영화 정보를 불러올 수 없습니다.");
        const data = await res.json();
        setMovieDetail(data);
        // MoviePreviewDto로 변환
        setMoviePreview({
          id: data.id,
          title: data.title,
          poster_path: data.poster_path,
          backdrop_path: data.backdrop_path,
          ott_providers: data.ott?.ott_providers || [],
          release_date: data.release_date,
          rating: data.certification?.certification || "등급 정보 없음",
          genres: data.genres?.map((g: { name: string }) => g.name) || [],
          country: data.country || "",
          runtime: data.runtime ? `${data.runtime}분` : "러닝타임 정보 없음",
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : "에러가 발생했습니다.");
        setMoviePreview(null);
        setMovieDetail(null);
      } finally {
        setLoading(false);
      }
    };
    fetchMovieDetail();
  }, [movieId]);

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
            detail={movieDetail}
            detailLoading={loading}
            onOpenDetail={() => {}}
          />
          <MovieReviewList movieId={moviePreview.id} />
        </>
      )}
    </Modal>
  );
};

export default MovieDetailModal;
