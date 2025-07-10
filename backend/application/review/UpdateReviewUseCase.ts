import { Review } from "../../domain/entities/Review";
import { ReviewRepository } from "../../domain/repositories/ReviewRepository";

export class UpdateReviewUseCase {
  constructor(private reviewRepository: ReviewRepository) {}

  async execute(id: number, content: string): Promise<Review> {
    return this.reviewRepository.update(id, content);
  }
}
