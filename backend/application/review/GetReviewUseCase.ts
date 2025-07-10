import { Review } from "../../domain/entities/Review";
import { ReviewRepository } from "../../domain/repositories/ReviewRepository";

export class GetReviewUseCase {
  constructor(private reviewRepository: ReviewRepository) {}

  async getById(id: number): Promise<Review | null> {
    return this.reviewRepository.findById(id);
  }

  async getByMovieId(movieId: string): Promise<Review[]> {
    return this.reviewRepository.findByMovieId(movieId);
  }

  async getByUserId(userId: string): Promise<Review[]> {
    return this.reviewRepository.findByUserId(userId);
  }
}
