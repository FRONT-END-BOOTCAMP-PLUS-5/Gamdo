import { NextResponse } from "next/server";
import { GetMovieDetailsUseCase } from "@/backend/application/movies/usecases/GetMovieDetailsUseCase";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid movie id" }, { status: 400 });
  }

  const usecase = new GetMovieDetailsUseCase();
  try {
    const movie = await usecase.execute(id);
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
