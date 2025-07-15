import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabase/client";
import { SbUserRepository } from "@/backend/infrastructure/repositories/SbUserRepository";
import { GetUserInfoUsecase } from "@/backend/application/user/usecase/GetUserInfoUsecase";
import { UpdateUserInfoUsecase } from "@/backend/application/user/usecase/UpdateUserInfoUsecase";
import { UserWithoutSensitive } from "@/backend/application/signin/dtos/SigninDto";
import { verifyAuthTokens } from "@/backend/common/auth/verifyAuthTokens";

export async function GET(req: NextRequest) {
  try {
    const authResult = verifyAuthTokens(req);
    if (authResult.code !== "ok") {
      return NextResponse.json(
        { error: authResult.code },
        { status: authResult.status }
      );
    }
    const userId = authResult.userId;
    if (!userId) {
      return NextResponse.json(
        { error: "Invalid token payload: userId missing" },
        { status: 400 }
      );
    }
    const userRepository = new SbUserRepository(supabase);
    const getUserInfoUsecase = new GetUserInfoUsecase(userRepository);
    const user = await getUserInfoUsecase.execute(userId);

    const userWithoutSensitive: UserWithoutSensitive = {
      userId: user.userId!,
      name: user.name,
      loginId: user.loginId,
      nickname: user.nickname,
      profileImage: user.profileImage,
      role: user.role,
    };
    return NextResponse.json({ user: userWithoutSensitive }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 404 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const authResult = verifyAuthTokens(req);
    if (authResult.code !== "ok") {
      return NextResponse.json(
        { error: authResult.code },
        { status: authResult.status }
      );
    }
    const userId = authResult.userId;
    if (!userId) {
      return NextResponse.json(
        { error: "Invalid token payload: userId missing" },
        { status: 400 }
      );
    }

    const { nickname, password } = await req.json();
    if (!nickname || !password) {
      return NextResponse.json(
        { error: "nickname, password are required" },
        { status: 400 }
      );
    }
    const userRepository = new SbUserRepository(supabase);
    const updateUserInfoUsecase = new UpdateUserInfoUsecase(userRepository);
    const user = await updateUserInfoUsecase.execute(
      userId,
      nickname,
      password
    );
    return NextResponse.json({ user }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 404 });
  }
}
