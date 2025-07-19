import { NextRequest, NextResponse } from "next/server";
import { GetMovieDetailsUseCase } from "../../../../backend/application/movies/usecases/GetMovieDetailsUseCase";

const getMovieDetailsUseCase = new GetMovieDetailsUseCase();

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
