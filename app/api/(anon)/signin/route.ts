import { NextRequest, NextResponse } from "next/server";
import { SbUserRepository } from "../../../../backend/infrastructure/repositories/SbUserRepository";
import { supabase } from "@/utils/supabase/client";
import { SigninUsecase } from "@/backend/application/signin/usecases/SigninUsecase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userRepository = new SbUserRepository(supabase);
    const signinUseCase = new SigninUsecase(userRepository);

    const result = await signinUseCase.execute(body);
    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
