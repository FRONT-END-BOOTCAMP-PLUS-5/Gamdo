import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabase/client";
import { SbUserRepository } from "@/backend/infrastructure/repositories/SbUserRepository";
import { GetUserInfoUsecase } from "@/backend/application/user/usecase/GetUserInfoUsecase";
import { UpdateUserInfoUsecase } from "@/backend/application/user/usecase/UpdateUserInfoUsecase";
import { UserWithoutSensitive } from "@/backend/application/signin/dtos/SigninDto";
import { verifyAccessToken } from "@/backend/common/auth/jwt";

export async function GET(req: NextRequest) {
  try {
    const accessToken = req.cookies.get("access_token")?.value;
    if (!accessToken) {
      return NextResponse.json(
        { error: "Access token is required" },
        { status: 401 }
      );
    }
    let payload: { userId: string };
    try {
      payload = verifyAccessToken(accessToken) as { userId: string };
    } catch {
      return NextResponse.json(
        { error: "Invalid or expired access token" },
        { status: 401 }
      );
    }
    const userId = payload.userId;
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
    const { userId, nickname, password } = await req.json();
    if (!userId || !nickname || !password) {
      return NextResponse.json(
        { error: "userId, nickname, password are required" },
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
