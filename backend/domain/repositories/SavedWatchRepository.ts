import { SavedWatch } from "../entities/SavedWatch";

export interface SavedWatchRepository {
  saveSavedWatch(savedWatchData: SavedWatch): Promise<SavedWatch>;
  deleteSavedWatch(userId: string, movieId: string): Promise<void>;
  findSavedWatch(
    userId: string,
    maxLength: number
  ): Promise<{ items: SavedWatch[]; totalCount: number }>;
  findByUserIdAndMovieId(
    userId: string,
    movieId: string
  ): Promise<SavedWatch | null>;
}
