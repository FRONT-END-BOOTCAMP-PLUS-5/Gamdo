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
}
