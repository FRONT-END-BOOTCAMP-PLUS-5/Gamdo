import { ReviewRepository } from "../../domain/repositories/ReviewRepository";

export class DeleteReviewUseCase {
  constructor(private reviewRepository: ReviewRepository) {}

  async execute(id: number): Promise<void> {
    return this.reviewRepository.delete(id);
  }
}
