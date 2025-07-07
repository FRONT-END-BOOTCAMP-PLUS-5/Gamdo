// backend/api/signup.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { SbUserRepository } from "../../../../backend/infrastructure/repositories/SbUserRepository";
import { SignupUseCase } from "@/backend/application/signup/usecases/SignupUsecase";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = {
      name: "테스트유저",
      login_id: "test" + Math.floor(Math.random() * 10000) + "@example.com",
      //   login_id: "test1531@example.com",
      password: "testpassword",
      nickname: null,
      profile_image: null,
    };

    // const body = await req.json();
    const userRepository = new SbUserRepository(supabase);
    const signupUseCase = new SignupUseCase(userRepository);

    const result = await signupUseCase.execute(body);
    return NextResponse.json(result, { status: 201 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
