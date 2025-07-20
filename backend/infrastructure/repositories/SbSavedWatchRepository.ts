import { SavedWatch } from "@/backend/domain/entities/SavedWatch";
import { SavedWatchRepository } from "@/backend/domain/repositories/SavedWatchRepository";
import { SupabaseClient } from "@supabase/supabase-js";
import { Mapper } from "../mappers/Mapper";
import { SavedWatchTable } from "../types/database";

export class SbSavedWatchRepository implements SavedWatchRepository {
  constructor(private supabase: SupabaseClient) {}

  async saveSavedWatch(savedWatchData: SavedWatch): Promise<SavedWatch> {
    const { data, error } = await this.supabase
      .from("saved_watch")
      .insert({
        user_id: savedWatchData.userId,
        movie_id: savedWatchData.movieId,
        is_recommended: savedWatchData.isRecommended,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return Mapper.toSavedWatch(data as unknown as SavedWatchTable);
    new SavedWatch(data.user_id, data.movie_id, data.is_recommended);
  }

  async deleteSavedWatch(userId: string, movieId: string): Promise<void> {
    const { error } = await this.supabase
      .from("saved_watch")
      .delete()
      .eq("user_id", userId)
      .eq("movie_id", movieId);
    if (error) throw new Error(error.message);
  }

  async findSavedWatch(
    userId: string,
    maxLength: number = 6
  ): Promise<{ items: SavedWatch[]; totalCount: number }> {
    // 전체 개수를 가져오기 위한 쿼리
    const { count, error: countError } = await this.supabase
      .from("saved_watch")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    if (countError) throw new Error(countError.message);

    // 제한된 개수의 데이터를 가져오기 위한 쿼리
    const { data, error } = await this.supabase
      .from("saved_watch")
      .select("*")
      .eq("user_id", userId)
      .limit(maxLength);

    if (error) throw new Error(error.message);
    if (!data || data.length === 0) return { items: [], totalCount: 0 };

    return Mapper.toSavedWatchList(data, count ?? 0);
  }

  async findByUserIdAndMovieId(
    userId: string,
    movieId: string
  ): Promise<SavedWatch | null> {
    const { data, error } = await this.supabase
      .from("saved_watch")
      .select("*")
      .eq("user_id", userId)
      .eq("movie_id", movieId)
      .single();

    if (error) {
      // 데이터가 없는 경우 (찜하지 않은 경우)
      if (error.code === "PGRST116") {
        return null;
      }
      // 다른 에러인 경우
      throw new Error(error.message);
    }

    return Mapper.toSavedWatch(data as unknown as SavedWatchTable);
  }
}
