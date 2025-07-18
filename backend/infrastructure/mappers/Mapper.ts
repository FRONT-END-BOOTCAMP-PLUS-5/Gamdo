import { SavedWatch } from "@/backend/domain/entities/SavedWatch";
import { SavedWatchTable } from "../types/database";

export class Mapper {
  static toSavedWatch(source: SavedWatchTable): SavedWatch {
    return new SavedWatch(
      source.user_id,
      source.movie_id,
      source.is_recommended
    );
  }
}
