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

  /**
   * 사용자의 특정 월 저장된 영화 목록 조회
   * @param userId 사용자 ID
   * @param year 년도
   * @param month 월 (1-12)
   * @returns 저장된 영화 목록
   */
  async findByUserIdAndMonth(
    userId: string,
    year: number,
    month: number
  ): Promise<SavedMovie[]> {
    try {
      // 월의 시작일과 끝일 계산
      const startDate = `${year}-${month.toString().padStart(2, "0")}-01`;
      const endDate = new Date(year, month + 1, 0).toISOString().split("T")[0]; // 월의 마지막 날

      const { data, error } = await supabase
        .from("calendar")
        .select("*")
        .eq("user_id", userId)
        .gte("saved_at", startDate)
        .lte("saved_at", endDate)
        .order("saved_at", { ascending: true });

      if (error) {
        throw new Error(`수파베이스 월별 조회 오류: ${error.message}`);
      }

      // 수파베이스 데이터를 SavedMovie 엔티티로 변환
      return data.map(
        (item) => new SavedMovie(item.user_id, item.movie_id, item.saved_at)
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "알 수 없는 오류";
      throw new Error(
        `월별 영화 목록 조회 중 오류가 발생했습니다: ${errorMessage}`
      );
    }
  }

  /**
   * 사용자의 특정 영화 저장된 날짜 목록 조회
   * @param userId 사용자 ID
   * @param movieId 영화 ID
   * @returns 저장된 영화 목록
   */
  async findByUserIdAndMovieId(
    userId: string,
    movieId: string
  ): Promise<SavedMovie[]> {
    try {
      const { data, error } = await supabase
        .from("calendar")
        .select("*")
        .eq("user_id", userId)
        .eq("movie_id", movieId)
        .order("saved_at", { ascending: true });

      if (error) {
        throw new Error(`수파베이스 영화별 조회 오류: ${error.message}`);
      }

      // 수파베이스 데이터를 SavedMovie 엔티티로 변환
      return data.map(
        (item) => new SavedMovie(item.user_id, item.movie_id, item.saved_at)
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "알 수 없는 오류";
      throw new Error(
        `영화별 저장 목록 조회 중 오류가 발생했습니다: ${errorMessage}`
      );
    }
  }

  /**
   * 사용자의 특정 날짜 저장된 영화 목록 조회
   * @param userId 사용자 ID
   * @param date 날짜 (YYYY-MM-DD)
   * @returns 저장된 영화 목록
   */
  async findByUserIdAndDate(
    userId: string,
    date: string
  ): Promise<SavedMovie[]> {
    try {
      const { data, error } = await supabase
        .from("calendar")
        .select("*")
        .eq("user_id", userId)
        .eq("saved_at", date)
        .order("saved_at", { ascending: true });

      if (error) {
        throw new Error(`수파베이스 날짜별 조회 오류: ${error.message}`);
      }

      // 수파베이스 데이터를 SavedMovie 엔티티로 변환
      return data.map(
        (item) => new SavedMovie(item.user_id, item.movie_id, item.saved_at)
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "알 수 없는 오류";
      throw new Error(
        `날짜별 저장 목록 조회 중 오류가 발생했습니다: ${errorMessage}`
      );
    }
  }

  /**
   * 사용자의 특정 영화와 날짜로 저장된 영화 삭제
   * @param userId 사용자 ID
   * @param movieId 영화 ID
   * @param date 날짜 (YYYY-MM-DD)
   * @returns 삭제 성공 여부
   */
  async deleteByUserIdAndMovieIdAndDate(
    userId: string,
    movieId: string,
    date: string
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("calendar")
        .delete()
        .eq("user_id", userId)
        .eq("movie_id", movieId)
        .eq("saved_at", date);

      if (error) {
        throw new Error(`수파베이스 삭제 오류: ${error.message}`);
      }

      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "알 수 없는 오류";
      throw new Error(`영화 삭제 중 오류가 발생했습니다: ${errorMessage}`);
    }
  }

  /**
   * 사용자의 특정 영화 삭제 (모든 날짜)
   * @param userId 사용자 ID
   * @param movieId 영화 ID
   * @returns 삭제 성공 여부
   */
  async deleteByUserIdAndMovieId(
    userId: string,
    movieId: string
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("calendar")
        .delete()
        .eq("user_id", userId)
        .eq("movie_id", movieId);

      if (error) {
        throw new Error(`수파베이스 삭제 오류: ${error.message}`);
      }

      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "알 수 없는 오류";
      throw new Error(`영화 삭제 중 오류가 발생했습니다: ${errorMessage}`);
    }
  }
}
