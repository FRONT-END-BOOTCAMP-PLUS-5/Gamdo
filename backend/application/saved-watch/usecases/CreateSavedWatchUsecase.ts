import { SavedWatchRepository } from "@/backend/domain/repositories/SavedWatchRepository";
import { CreateSavedWatchDto } from "../dtos/CreateSavedWatchDto";
import { SavedWatch } from "@/backend/domain/entities/SavedWatch";

export class CreateSavedWatchUsecase {
  constructor(private savedWatchRepository: SavedWatchRepository) {}

  async execute(
    savedWatchDto: CreateSavedWatchDto
  ): Promise<CreateSavedWatchDto> {
    const saveSavedWatch = new SavedWatch(
      savedWatchDto.userId,
      savedWatchDto.movieId,
      savedWatchDto.isRecommended
    );

    const savedWatch = await this.savedWatchRepository.saveSavedWatch(
      saveSavedWatch
    );
    return savedWatch;
  }
}
