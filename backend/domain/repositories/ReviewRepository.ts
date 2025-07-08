import { Review } from "../entities/Review";

export interface ReviewRepository {
  create(review: Review): Promise<Review>;
}
