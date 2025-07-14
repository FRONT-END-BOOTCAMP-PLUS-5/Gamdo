export class SavedMovie {
  constructor(
    public userId: string,
    public movieId: string,
    public selectedDate: string, // YYYY-MM-DD 형식
    public posterImageUrl: string,
    public savedMovieId?: string,
    public createdAt?: string
  ) {}
}
