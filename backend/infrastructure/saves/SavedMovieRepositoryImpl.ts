import { SavedMovie } from "../../domain/entities/saves/SavedMovie";
import { SavedMovieRepository } from "../../domain/repositories/saves/SavedMovieRepository";

export class SavedMovieRepositoryImpl implements SavedMovieRepository {
  // 테스트용 메모리 저장소 (나중에 Supabase로 대체)
  private savedMovies: SavedMovie[] = [];
  private idCounter = 1;

  /**
   * 영화 저장 정보를 저장 (현재는 메모리에 저장, 나중에 Supabase 연동)
   * @param savedMovie 저장할 영화 정보
   * @returns 저장된 영화 정보
   */
  async save(savedMovie: SavedMovie): Promise<SavedMovie> {
    // ID와 생성 시간 설정
    savedMovie.savedMovieId = this.idCounter.toString();
    savedMovie.createdAt = new Date().toISOString();
    this.idCounter++;

    // 메모리에 저장
    this.savedMovies.push(savedMovie);

    console.log("🎬 영화 저장 완료:", {
      savedMovieId: savedMovie.savedMovieId,
      userId: savedMovie.userId,
      movieId: savedMovie.movieId,
      selectedDate: savedMovie.selectedDate,
      posterImageUrl: savedMovie.posterImageUrl,
    });

    return savedMovie;
  }

  /**
   * 사용자의 저장된 영화 목록 조회
   * @param userId 사용자 ID
   * @returns 저장된 영화 목록
   */
  async findByUserId(userId: string): Promise<SavedMovie[]> {
    return this.savedMovies.filter((movie) => movie.userId === userId);
  }

  /**
   * 특정 영화 저장 정보 조회
   * @param savedMovieId 저장된 영화 ID
   * @returns 저장된 영화 정보 또는 null
   */
  async findById(savedMovieId: string): Promise<SavedMovie | null> {
    return (
      this.savedMovies.find((movie) => movie.savedMovieId === savedMovieId) ||
      null
    );
  }

  /**
   * 특정 영화 저장 정보 삭제
   * @param savedMovieId 저장된 영화 ID
   * @returns 삭제 성공 여부
   */
  async delete(savedMovieId: string): Promise<boolean> {
    const index = this.savedMovies.findIndex(
      (movie) => movie.savedMovieId === savedMovieId
    );
    if (index > -1) {
      this.savedMovies.splice(index, 1);
      return true;
    }
    return false;
  }
}
