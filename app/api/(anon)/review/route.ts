import { NextRequest, NextResponse } from "next/server";
import { ReviewRepositoryImpl } from "../../../../backend/infrastructure/repositories/ReviewRepositoryImpl";
import { CreateReviewUseCase } from "../../../../backend/application/review/CreateReviewUseCase";

const reviewRepository = new ReviewRepositoryImpl();
const createReviewUseCase = new CreateReviewUseCase(reviewRepository);

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
    console.error("리뷰 POST 에러:", error);
    const message =
      error instanceof Error
        ? error.message
        : typeof error === "object"
        ? JSON.stringify(error)
        : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
