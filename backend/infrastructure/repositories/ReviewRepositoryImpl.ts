import { Review } from "../../domain/entities/Review";
import { ReviewRepository } from "../../domain/repositories/ReviewRepository";
import { supabase } from "../../../utils/supabase/client";

export class ReviewRepositoryImpl implements ReviewRepository {
  // 리뷰 생성
  async create(review: Review): Promise<Review> {
    const { data, error } = await supabase
      .from("reviews")
      .insert([
        {
          user_id: review.userId,
          movie_id: review.movieId,
          content: review.content,
        },
      ])
      .select()
      .single();
    if (error) throw error;
    return new Review(
      data.id,
      data.user_id,
      data.movie_id,
      data.content,
      data.created_at ? new Date(data.created_at) : undefined
    );
  }

  // 아이디별 리뷰 조회
  async findById(id: number): Promise<Review | null> {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null; // No rows returned
      throw error;
    }

    return new Review(
      data.id,
      data.user_id,
      data.movie_id,
      data.content,
      data.created_at ? new Date(data.created_at) : undefined
    );
  }

  // 영화 아이디별 리뷰 조회
  async findByMovieId(movieId: string): Promise<Review[]> {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("movie_id", movieId)
      .order("created_at", { ascending: false }); // 기본값: 최신순 정렬

    if (error) throw error;

    return data.map(
      (row) =>
        new Review(
          row.id,
          row.user_id,
          row.movie_id,
          row.content,
          row.created_at ? new Date(row.created_at) : undefined
        )
    );
  }

  //유저 아이디별 리뷰 조회
  async findByUserId(userId: string): Promise<Review[]> {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data.map(
      (row) =>
        new Review(
          row.id,
          row.user_id,
          row.movie_id,
          row.content,
          row.created_at ? new Date(row.created_at) : undefined
        )
    );
  }

  //리뷰수정
  async update(id: number, content: string): Promise<Review> {
    const { data, error } = await supabase
      .from("reviews")
      .update({ content })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return new Review(
      data.id,
      data.user_id,
      data.movie_id,
      data.content,
      data.created_at ? new Date(data.created_at) : undefined
    );
  }

  //리뷰삭제
  async delete(id: number): Promise<void> {
    const { error } = await supabase.from("reviews").delete().eq("id", id);

    if (error) throw error;
  }
}
