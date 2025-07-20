import { SavedWatch } from "@/backend/domain/entities/SavedWatch";
import { SavedWatchRepository } from "@/backend/domain/repositories/SavedWatchRepository";

export class GetSavedWatchUsecase {
  constructor(private savedWatchRepository: SavedWatchRepository) {}

  async execute(
    userId: string,
    maxLength: number
  ): Promise<{ items: SavedWatch[]; totalCount: number }> {
    return this.savedWatchRepository.findSavedWatch(userId, maxLength);
  }
}
