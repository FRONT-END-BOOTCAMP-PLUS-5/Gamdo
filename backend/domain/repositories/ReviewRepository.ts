import { Review } from "../entities/Review";

export interface ReviewRepository {
  create(review: Review): Promise<Review>;
  findById(id: number): Promise<Review | null>;
  findByMovieId(movieId: string): Promise<Review[]>;
  findByUserId(userId: string): Promise<Review[]>;
  update(id: number, content: string): Promise<Review>;
  delete(id: number): Promise<void>;
}
