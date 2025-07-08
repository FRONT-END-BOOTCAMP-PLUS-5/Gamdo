import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabase/client";
import { SbUserRepository } from "@/backend/infrastructure/repositories/SbUserRepository";
import { CheckNicknameExistsUsecase } from "@/backend/application/signup/usecases/CheckNicknameExistsUsecase";

export async function POST(req: NextRequest) {
  try {
    const { nickname } = await req.json();
    if (!nickname) {
      return NextResponse.json(
        { error: "닉네임을 입력해주세요." },
        { status: 400 }
      );
    }
    const userRepository = new SbUserRepository(supabase);
    const checkNicknameExistsUseCase = new CheckNicknameExistsUsecase(
      userRepository
    );

    const exists = await checkNicknameExistsUseCase.execute(nickname);
    return NextResponse.json({ exists }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
