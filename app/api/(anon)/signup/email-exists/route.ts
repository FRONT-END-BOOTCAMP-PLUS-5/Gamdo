import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabase/client";
import { SbUserRepository } from "@/backend/infrastructure/repositories/SbUserRepository";
import { CheckEmailExistsUsecase } from "@/backend/application/signup/usecases/CheckEmailExistsUsecase";

export async function POST(req: NextRequest) {
  try {
    const { loginId } = await req.json();
    if (!loginId) {
      return NextResponse.json(
        { error: "이메일 형식의 아이디를 입력해주세요." },
        { status: 400 }
      );
    }
    const userRepository = new SbUserRepository(supabase);
    const checkEmailExistsUseCase = new CheckEmailExistsUsecase(userRepository);

    const exists = await checkEmailExistsUseCase.execute(loginId);
    return NextResponse.json({ exists }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
