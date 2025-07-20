export class Review {
  constructor(
    public readonly id: number | null,
    public readonly userId: string,
    public readonly movieId: string,
    public readonly content: string,
    public readonly createdAt?: Date
  ) {}
}
