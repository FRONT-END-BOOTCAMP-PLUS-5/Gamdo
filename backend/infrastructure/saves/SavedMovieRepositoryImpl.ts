import { SavedMovie } from "../../domain/entities/saves/SavedMovie";
import { SavedMovieRepository } from "../../domain/repositories/saves/SavedMovieRepository";
import { supabase } from "../../../utils/supabase/client";

/**
 * 저장된 영화 정보 리포지토리 구현체 (Supabase)
 */
export class SavedMovieRepositoryImpl implements SavedMovieRepository {
  /**
   * 영화 저장 정보를 수파베이스 calendar 테이블에 저장
   * @param savedMovie 저장할 영화 정보
   * @returns 저장된 영화 정보
   */
  async save(savedMovie: SavedMovie): Promise<SavedMovie> {
    try {
      // 수파베이스 calendar 테이블에 저장
      const { error } = await supabase.from("calendar").insert([
        {
          user_id: savedMovie.userId,
          movie_id: savedMovie.movieId,
          saved_at: savedMovie.savedAt,
        },
      ]);

      if (error) {
        throw new Error(`수파베이스 저장 오류: ${error.message}`);
      }

      return savedMovie;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "알 수 없는 오류";
      throw new Error(`영화 저장 중 오류가 발생했습니다: ${errorMessage}`);
    }
  }

  /**
   * 사용자의 저장된 영화 목록 조회
   * @param userId 사용자 ID
   * @returns 저장된 영화 목록
   */
  async findByUserId(userId: string): Promise<SavedMovie[]> {
    try {
      const { data, error } = await supabase
        .from("calendar")
        .select("*")
        .eq("user_id", userId);

      if (error) {
        throw new Error(`수파베이스 조회 오류: ${error.message}`);
      }

      // 수파베이스 데이터를 SavedMovie 엔티티로 변환
      return data.map(
        (item) => new SavedMovie(item.user_id, item.movie_id, item.saved_at)
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "알 수 없는 오류";
      throw new Error(`영화 목록 조회 중 오류가 발생했습니다: ${errorMessage}`);
    }
  }
}
