import { SavedMovie } from "../../entities/saves/SavedMovie";

/**
 * 저장된 영화 정보 리포지토리 인터페이스
 */
export interface SavedMovieRepository {
  /**
   * 영화 저장 정보를 수파베이스 calendar 테이블에 저장
   * @param savedMovie 저장할 영화 정보
   * @returns 저장된 영화 정보
   */
  save(savedMovie: SavedMovie): Promise<SavedMovie>;

  /**
   * 사용자의 저장된 영화 목록 조회
   * @param userId 사용자 ID
   * @returns 저장된 영화 목록
   */
  findByUserId(userId: string): Promise<SavedMovie[]>;

  /**
   * 사용자의 특정 월 저장된 영화 목록 조회
   * @param userId 사용자 ID
   * @param year 년도
   * @param month 월 (1-12)
   * @returns 저장된 영화 목록
   */
  findByUserIdAndMonth(
    userId: string,
    year: number,
    month: number
  ): Promise<SavedMovie[]>;

  /**
   * 사용자의 특정 영화 저장된 날짜 목록 조회
   * @param userId 사용자 ID
   * @param movieId 영화 ID
   * @returns 저장된 영화 목록
   */
  findByUserIdAndMovieId(
    userId: string,
    movieId: string
  ): Promise<SavedMovie[]>;

  /**
   * 사용자의 특정 날짜 저장된 영화 목록 조회
   * @param userId 사용자 ID
   * @param date 날짜 (YYYY-MM-DD)
   * @returns 저장된 영화 목록
   */
  findByUserIdAndDate(userId: string, date: string): Promise<SavedMovie[]>;

  /**
   * 사용자의 특정 영화 삭제
   * @param userId 사용자 ID
   * @param movieId 영화 ID
   * @returns 삭제 성공 여부
   */
  deleteByUserIdAndMovieId(userId: string, movieId: string): Promise<boolean>;
}
