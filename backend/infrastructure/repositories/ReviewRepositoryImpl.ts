import { Review } from "../../domain/entities/Review";
import { ReviewRepository } from "../../domain/repositories/ReviewRepository";
import { supabase } from "../../../utils/supabase/client";

export class ReviewRepositoryImpl implements ReviewRepository {
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
}
