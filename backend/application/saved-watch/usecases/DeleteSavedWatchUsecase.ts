import { SavedWatchRepository } from "@/backend/domain/repositories/SavedWatchRepository";

export class DeleteSavedWatchUsecase {
  constructor(private savedWatchRepository: SavedWatchRepository) {}

  async execute(userId: string, movieId: string): Promise<void> {
    await this.savedWatchRepository.deleteSavedWatch(userId, movieId);
    return;
  }
}
