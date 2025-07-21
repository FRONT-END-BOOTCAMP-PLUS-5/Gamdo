import { SavedMovieRepository } from "@/backend/domain/repositories/saves/SavedMovieRepository";

export interface GetSavedMovieDto {
  userId: string;
  movieId: string;
}

export interface SaveDateInfo {
  date: string; // YYYY-MM-DD 형식
  movieId: string;
}

export class GetSavedMovieUseCase {
  constructor(private savedMovieRepository: SavedMovieRepository) {}

  async execute(dto: GetSavedMovieDto): Promise<SaveDateInfo[]> {
    const savedMovies = await this.savedMovieRepository.findByUserIdAndMovieId(
      dto.userId,
      dto.movieId
    );

    return savedMovies.map((savedMovie) => ({
      date: savedMovie.savedAt,
      movieId: savedMovie.movieId,
    }));
  }
}
