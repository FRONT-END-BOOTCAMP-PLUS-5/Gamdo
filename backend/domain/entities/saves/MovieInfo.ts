/**
 * 영화 정보 엔티티
 */
export interface MovieInfo {
  id: number;
  title: string;
  overview: string;
  releaseDate: string;
}

/**
 * 영화 정보 조회 결과 타입
 */
export type MovieInfoResult =
  | {
      success: true;
      movieInfo: MovieInfo;
    }
  | {
      success: false;
      error: string;
    };
