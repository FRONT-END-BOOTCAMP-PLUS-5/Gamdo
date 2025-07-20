import { NextRequest, NextResponse } from "next/server";
import { GetMovieDetailsUseCase } from "@/backend/application/movies/usecases/GetMovieDetailsUseCase";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const movieId = Number(id);

  if (isNaN(movieId)) {
    return NextResponse.json({ error: "Invalid movie id" }, { status: 400 });
  }

  const usecase = new GetMovieDetailsUseCase();
  try {
    const movie = await usecase.execute(movieId);
    if (!movie) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }
    return NextResponse.json(movie);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
