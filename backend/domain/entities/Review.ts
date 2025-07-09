export class Review {
  constructor(
    public readonly id: number | null,
    public readonly userId: number,
    public readonly movieId: string,
    public readonly content: string,
    public readonly createdAt?: Date
  ) {}
}
