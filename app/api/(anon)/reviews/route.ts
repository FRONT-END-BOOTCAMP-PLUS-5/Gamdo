import { NextRequest, NextResponse } from "next/server";
import { ReviewRepositoryImpl } from "../../../../backend/infrastructure/repositories/ReviewRepositoryImpl";
import { CreateReviewUseCase } from "../../../../backend/application/review/CreateReviewUseCase";
import { GetReviewUseCase } from "../../../../backend/application/review/GetReviewUseCase";
import { UpdateReviewUseCase } from "../../../../backend/application/review/UpdateReviewUseCase";
import { DeleteReviewUseCase } from "../../../../backend/application/review/DeleteReviewUseCase";
import { verifyAuthTokens } from "@/backend/common/auth/verifyAuthTokens";

const reviewRepository = new ReviewRepositoryImpl();
const createReviewUseCase = new CreateReviewUseCase(reviewRepository);
const getReviewUseCase = new GetReviewUseCase(reviewRepository);
const updateReviewUseCase = new UpdateReviewUseCase(reviewRepository);
const deleteReviewUseCase = new DeleteReviewUseCase(reviewRepository);

export async function POST(req: NextRequest) {
  try {
    // 1. 토큰에서 userId 추출
    const tokenResult = verifyAuthTokens(req);
    if (tokenResult.code !== "ok") {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      );
    }
    const userId = tokenResult.userId;

    // 2. body 파싱
    const { movieId, content } = await req.json();
    if (!movieId || !content) {
      return NextResponse.json(
        { error: "movieId, content are required" },
        { status: 400 }
      );
    }

    // 3. 리뷰 생성
    const review = await createReviewUseCase.execute(
      userId,
      String(movieId),
      content
    );
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

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const movieId = searchParams.get("movieId");
    const userId = searchParams.get("userId");

    if (id) {
      const review = await getReviewUseCase.getById(Number(id));
      if (!review) {
        return NextResponse.json(
          { error: "Review not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ review });
    }

    if (movieId) {
      const reviews = await getReviewUseCase.getByMovieId(movieId);
      return NextResponse.json({ reviews });
    }

    if (userId) {
      const reviews = await getReviewUseCase.getByUserId(userId);
      return NextResponse.json({ reviews });
    }

    return NextResponse.json(
      { error: "id, movieId, or userId parameter is required" },
      { status: 400 }
    );
  } catch (error: unknown) {
    console.error("리뷰 GET 에러:", error);
    const message =
      error instanceof Error
        ? error.message
        : typeof error === "object"
        ? JSON.stringify(error)
        : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "id parameter is required" },
        { status: 400 }
      );
    }

    const { content } = await req.json();
    if (!content) {
      return NextResponse.json(
        { error: "content is required" },
        { status: 400 }
      );
    }

    const review = await updateReviewUseCase.execute(Number(id), content);
    return NextResponse.json({ review });
  } catch (error: unknown) {
    console.error("리뷰 PUT 에러:", error);
    const message =
      error instanceof Error
        ? error.message
        : typeof error === "object"
        ? JSON.stringify(error)
        : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "id parameter is required" },
        { status: 400 }
      );
    }

    await deleteReviewUseCase.execute(Number(id));
    return NextResponse.json({ message: "Review deleted successfully" });
  } catch (error: unknown) {
    console.error("리뷰 DELETE 에러:", error);
    const message =
      error instanceof Error
        ? error.message
        : typeof error === "object"
        ? JSON.stringify(error)
        : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
