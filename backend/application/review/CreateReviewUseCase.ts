import { Review } from "../../domain/entities/Review";
import { ReviewRepository } from "../../domain/repositories/ReviewRepository";

export class CreateReviewUseCase {
  constructor(private reviewRepository: ReviewRepository) {}

  async execute(
    userId: string,
    movieId: string,
    content: string
  ): Promise<Review> {
    const review = new Review(null, userId, movieId, content);
    return this.reviewRepository.create(review);
  }
}
