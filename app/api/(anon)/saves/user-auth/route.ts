import { NextRequest, NextResponse } from "next/server";
import { GetUserFromTokenUseCase } from "../../../../../backend/application/saves/usecases/GetUserFromTokenUseCase";
import { UserAuthRepositoryImpl } from "../../../../../backend/infrastructure/saves/UserAuthRepositoryImpl";

/**
 * 사용자 인증 정보 확인 API
 * GET /api/saves/user-auth
 */
export async function GET(request: NextRequest) {
  try {
    // 쿠키에서 토큰 추출
    const accessToken = request.cookies.get("access_token")?.value;

    if (!accessToken) {
      return NextResponse.json(
        {
          success: false,
          error: "로그인이 필요합니다.",
        },
        { status: 401 }
      );
    }

    // 의존성 주입 및 UseCase 실행
    const userAuthRepository = new UserAuthRepositoryImpl();
    const getUserFromTokenUseCase = new GetUserFromTokenUseCase(
      userAuthRepository
    );

    const result = getUserFromTokenUseCase.execute({ accessToken });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        userId: result.userId,
        loginId: result.loginId,
        name: result.name,
        nickname: result.nickname,
        role: result.role,
      },
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "사용자 인증 정보를 확인하는 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
