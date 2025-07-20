"use client";

import React from "react";
import { useParams } from "next/navigation";
import MovieDetailModal from "../../movie-detail/components/MovieDetailModal";

export default function MovieDetailPage() {
  const params = useParams();
  const movieId = Number(params.id);

  return (
    <div className="min-h-screen bg-[#1D1F28] flex items-center justify-center">
      <MovieDetailModal
        setModal={() => window.history.back()}
        movieId={movieId}
      />
    </div>
  );
}
