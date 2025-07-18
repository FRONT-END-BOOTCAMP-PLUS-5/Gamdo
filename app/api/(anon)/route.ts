import { NextRequest, NextResponse } from "next/server";
import { ReviewRepositoryImpl } from "../../../backend/infrastructure/repositories/ReviewRepositoryImpl";
import { CreateReviewUseCase } from "../../../backend/application/review/CreateReviewUseCase";
import { GetMovieDetailsUseCase } from "../../../backend/application/movies/usecases/GetMovieDetailsUseCase";

const reviewRepository = new ReviewRepositoryImpl();
const createReviewUseCase = new CreateReviewUseCase(reviewRepository);
const getMovieDetailsUseCase = new GetMovieDetailsUseCase();

export async function POST(req: NextRequest) {
  try {
    const { userId, movieId, content } = await req.json();
    if (!userId || !movieId || !content) {
      return NextResponse.json(
        { error: "userId, movieId, content are required" },
        { status: 400 }
      );
    }
    const review = await createReviewUseCase.execute(userId, movieId, content);
    return NextResponse.json({ review });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const movieId = searchParams.get("movieId");
    if (!movieId) {
      return NextResponse.json(
        { error: "movieId is required" },
        { status: 400 }
      );
    }
    const movie = await getMovieDetailsUseCase.execute(Number(movieId));
    return NextResponse.json({ movie });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
