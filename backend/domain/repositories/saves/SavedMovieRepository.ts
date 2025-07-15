import { SavedMovie } from "../../entities/saves/SavedMovie";

export interface SavedMovieRepository {
  /**
   * 영화 저장 정보를 데이터베이스에 저장
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
   * 특정 영화 저장 정보 조회
   * @param savedMovieId 저장된 영화 ID
   * @returns 저장된 영화 정보 또는 null
   */
  findById(savedMovieId: string): Promise<SavedMovie | null>;

  /**
   * 특정 영화 저장 정보 삭제
   * @param savedMovieId 저장된 영화 ID
   * @returns 삭제 성공 여부
   */
  delete(savedMovieId: string): Promise<boolean>;
}
