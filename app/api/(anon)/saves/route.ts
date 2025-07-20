import { NextRequest, NextResponse } from "next/server";
import { SavedMovieRepository } from "@/backend/domain/repositories/saves/SavedMovieRepository";
import { SavedMovieRepositoryImpl } from "@/backend/infrastructure/saves/SavedMovieRepositoryImpl";
import { SaveMovieUseCase } from "@/backend/application/saves/usecases/SaveMovieUseCase";
import { GetCalendarMoviesUseCase } from "@/backend/application/saves/usecases/GetCalendarMoviesUseCase";
import { DeleteSavedMovieUsecase } from "@/backend/application/saves/usecases/DeleteSavedMovieUsecase";
import { verifyAuthTokens } from "@/backend/common/auth/verifyAuthTokens";
import { MemoryCache } from "@/backend/common/cache/MemoryCache";
import { CalendarResponseDto } from "@/backend/application/saves/dtos/CalendarDto";

const savedMovieRepository: SavedMovieRepository =
  new SavedMovieRepositoryImpl();
const calendarCache = new MemoryCache<CalendarResponseDto>(10); // 10분 TTL

export async function POST(request: NextRequest) {
  try {
    // 1. 토큰 인증 및 사용자 ID 추출
    const authResult = verifyAuthTokens(request);
    if (authResult.code !== "ok") {
      return NextResponse.json(
        { success: false, message: authResult.code },
        { status: authResult.status }
      );
    }

    const userId = authResult.userId;

    // 2. 요청 본문에서 영화 정보 추출
    const { movieId, selectedDate } = await request.json();

    // 3. 영화 저장 UseCase 실행
    const saveMovieUseCase = new SaveMovieUseCase(savedMovieRepository);
    const result = await saveMovieUseCase.execute(userId, {
      movieId,
      selectedDate,
    });

    if (result.success) {
      // 4. 캘린더 캐시 무효화 (새 영화가 추가되었으므로)
      calendarCache.invalidateUserCache(userId);

      return NextResponse.json({
        success: true,
        message: "영화가 성공적으로 저장되었습니다.",
        savedMovie: result.savedMovie,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: result.message || "영화 저장에 실패했습니다.",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.log("영화 저장 중 서버 오류:", error);
    return NextResponse.json(
      {
        success: false,
        message: "서버 내부 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // 1. 토큰 인증 및 사용자 ID 추출
    const authResult = verifyAuthTokens(request);
    if (authResult.code !== "ok") {
      return NextResponse.json(
        { success: false, message: authResult.code },
        { status: authResult.status }
      );
    }

    const userId = authResult.userId;

    // 2. 요청 본문에서 영화 정보 추출
    const { movieId } = await request.json();

    // 3. 영화 삭제 UseCase 실행
    const deleteSavedMovieUsecase = new DeleteSavedMovieUsecase(
      savedMovieRepository
    );
    const result = await deleteSavedMovieUsecase.execute(userId, {
      movieId,
    });

    if (result.success) {
      // 4. 캘린더 캐시 무효화 (영화가 삭제되었으므로)
      calendarCache.invalidateUserCache(userId);

      return NextResponse.json({
        success: true,
        message: result.message,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: result.message || "영화 삭제에 실패했습니다.",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.log("영화 삭제 중 서버 오류:", error);
    return NextResponse.json(
      {
        success: false,
        message: "서버 내부 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // 1. 토큰 인증 및 사용자 ID 추출
    const authResult = verifyAuthTokens(request);
    if (authResult.code !== "ok") {
      return NextResponse.json(
        { success: false, message: authResult.code },
        { status: authResult.status }
      );
    }

    const userId = authResult.userId;

    // 2. 쿼리 파라미터에서 년도와 월 추출
    const { searchParams } = new URL(request.url);
    const year = parseInt(searchParams.get("year") || "");
    const month = parseInt(searchParams.get("month") || "");

    // 3. 파라미터 검증
    if (!year || !month || month < 1 || month > 12) {
      return NextResponse.json(
        {
          success: false,
          message:
            "올바른 년도와 월을 입력해주세요. (year: 4자리 숫자, month: 1-12)",
        },
        { status: 400 }
      );
    }

    // 4. 캐시 확인
    const cacheKey = calendarCache.generateCalendarKey(userId, year, month);
    const cachedData = calendarCache.get(cacheKey);

    if (cachedData) {
      console.log(`캐시 히트: ${cacheKey}`);
      return NextResponse.json(cachedData);
    }

    // 5. 캐시 미스 시 새 데이터 조회
    console.log(`캐시 미스: ${cacheKey}`);
    const getCalendarMoviesUseCase = new GetCalendarMoviesUseCase(
      savedMovieRepository
    );
    const result = await getCalendarMoviesUseCase.execute(userId, year, month);

    // 6. 성공 시 캐시에 저장
    if (result.success) {
      calendarCache.set(cacheKey, result);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("캘린더 영화 조회 중 서버 오류:", error);
    return NextResponse.json(
      {
        success: false,
        message: "서버 내부 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
