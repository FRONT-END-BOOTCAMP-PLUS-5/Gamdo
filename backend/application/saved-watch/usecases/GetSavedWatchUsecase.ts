import { SavedWatch } from "@/backend/domain/entities/SavedWatch";
import { SavedWatchRepository } from "@/backend/domain/repositories/SavedWatchRepository";

export class GetSavedWatchUsecase {
  constructor(private savedWatchRepository: SavedWatchRepository) {}

  async execute(userId: string): Promise<SavedWatch[]> {
    return this.savedWatchRepository.findSavedWatch(userId);
  }
}
