/**
 * 영화 포스터 정보 엔티티
 */
export interface MoviePoster {
  id: number;
  title: string;
  posterPath: string | null;
  backdropPath: string | null;
  posterUrl: string | null;
  backdropUrl: string | null;
  overview: string;
  releaseDate: string;
}

/**
 * 영화 포스터 조회 결과 타입
 */
export type MoviePosterResult =
  | {
      success: true;
      moviePoster: MoviePoster;
    }
  | {
      success: false;
      error: string;
    };
