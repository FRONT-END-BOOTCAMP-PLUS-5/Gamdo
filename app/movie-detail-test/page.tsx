"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

// 날짜 포맷팅 함수
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// UTF-8을 안전하게 Base64로 인코딩하는 함수
const safeBase64Encode = (str: string): string => {
  try {
    // UTF-8 문자열을 먼저 URI 인코딩한 후 Base64로 인코딩
    return btoa(unescape(encodeURIComponent(str)));
  } catch (error) {
    console.error("Base64 인코딩 오류:", error);
    // 대안: 영어로만 구성된 안전한 문자열로 변환
    const safeStr = JSON.stringify(str).replace(/[^\x00-\x7F]/g, "");
    return btoa(safeStr);
  }
};

// UTF-8 Base64를 안전하게 디코딩하는 함수
const safeBase64Decode = (str: string): string => {
  try {
    return decodeURIComponent(escape(atob(str)));
  } catch (error) {
    console.error("Base64 디코딩 오류:", error);
    return atob(str);
  }
};

// 쿠키에서 값 추출하는 함수
const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

// 쿠키 설정하는 함수
const setCookie = (name: string, value: string, days: number = 1): void => {
  if (typeof document === "undefined") return;

  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

  document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
  console.log(`🍪 쿠키 설정: ${name}=${value.substring(0, 20)}...`);
};

// 쿠키 삭제하는 함수
const deleteCookie = (name: string): void => {
  if (typeof document === "undefined") return;

  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
  console.log(`🗑️ 쿠키 삭제: ${name}`);
};

export default function MovieDetailTestPage() {
  const searchParams = useSearchParams();
  const movieId = searchParams.get("movieId");

  // 상태 관리
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [userInfo, setUserInfo] = useState<unknown>(null);
  const [posterInfo, setPosterInfo] = useState<unknown>(null);
  const [testResults, setTestResults] = useState<{
    userId: string;
    movieId: string;
    selectedDate: string;
    posterUrl: string;
  }>({
    userId: "",
    movieId: "",
    selectedDate: "",
    posterUrl: "",
  });

  // 컴포넌트 마운트 시 영화 ID 설정
  useEffect(() => {
    if (movieId) {
      setTestResults((prev) => ({
        ...prev,
        movieId: movieId,
      }));
      console.log(`🎬 쿼리스트링에서 영화 ID 추출: ${movieId}`);
    } else {
      console.log("⚠️ 쿼리스트링에 movieId가 없습니다.");
    }
  }, [movieId]);

  /**
   * 임시 로그인 쿠키 생성 (테스트용)
   */
  const createTestLoginCookie = () => {
    try {
      console.log("🔧 테스트 로그인 쿠키 생성 시작...");

      // 임시 사용자 정보 (한글 문제 해결을 위해 영어로 변경)
      const testUser = {
        userId: "test-user-123",
        name: "Test User",
        loginId: "test@example.com",
        nickname: "Tester",
        role: "user",
        koreanName: "테스트 사용자", // 한글 이름은 별도 필드로
        koreanNickname: "테스터", // 한글 닉네임은 별도 필드로
        iat: Math.floor(Date.now() / 1000), // issued at
        exp: Math.floor(Date.now() / 1000) + 3600, // expires in 1 hour
      };

      // 간단한 JWT 형태로 생성 (테스트용, 실제로는 백엔드에서 서명해야 함)
      const header = safeBase64Encode(
        JSON.stringify({ alg: "HS256", typ: "JWT" })
      );
      const payload = safeBase64Encode(JSON.stringify(testUser));
      const signature = "test-signature"; // 실제로는 SECRET으로 서명

      const testToken = `${header}.${payload}.${signature}`;

      console.log("🎫 생성된 테스트 토큰:", testToken);

      // 새로운 쿠키 설정 함수 사용
      setCookie("access_token", testToken, 1); // 1일 유효

      // 생성 확인
      const savedCookie = getCookie("access_token");
      console.log("🔍 저장된 쿠키 확인:", savedCookie ? "성공" : "실패");

      if (!savedCookie) {
        throw new Error("쿠키 저장에 실패했습니다.");
      }

      setUserInfo(testUser);
      setTestResults((prev) => ({ ...prev, userId: testUser.userId }));

      alert(
        `✅ 테스트 로그인 쿠키 생성 완료!\n사용자 ID: ${testUser.userId}\n\n개발자 도구 > Application > Cookies에서 확인 가능`
      );
      console.log("👤 테스트 사용자 정보:", testUser);
      console.log("🍪 현재 모든 쿠키:", document.cookie);
    } catch (error) {
      console.error("테스트 로그인 쿠키 생성 오류:", error);
      alert(`❌ 테스트 로그인 쿠키 생성에 실패했습니다.\n오류: ${error}`);
    }
  };

  /**
   * 테스트 로그아웃 (쿠키 삭제)
   */
  const clearTestLoginCookie = () => {
    try {
      console.log("🔧 로그아웃 시작...");

      // 새로운 쿠키 삭제 함수 사용
      deleteCookie("access_token");

      // 삭제 확인
      const remainingCookie = getCookie("access_token");
      console.log("🔍 쿠키 삭제 확인:", remainingCookie ? "실패" : "성공");

      // 상태 초기화
      setUserInfo(null);
      setTestResults((prev) => ({ ...prev, userId: "" }));

      alert("✅ 로그아웃 완료! 쿠키가 삭제되었습니다.");
      console.log("🍪 현재 모든 쿠키:", document.cookie);
    } catch (error) {
      console.error("로그아웃 오류:", error);
      alert(`❌ 로그아웃에 실패했습니다.\n오류: ${error}`);
    }
  };

  /**
   * 쿠키 상태 디버깅
   */
  const debugCookies = () => {
    console.log("🔍 === 쿠키 디버깅 시작 ===");
    console.log("📄 현재 document.cookie:", document.cookie);
    console.log("🌐 현재 도메인:", window.location.hostname);
    console.log("📍 현재 경로:", window.location.pathname);
    console.log("🔒 HTTPS 여부:", window.location.protocol === "https:");

    const accessToken = getCookie("access_token");
    console.log("🎫 access_token 쿠키:", accessToken ? "존재함" : "없음");

    if (accessToken) {
      console.log("🎫 토큰 길이:", accessToken.length);
      console.log("🎫 토큰 미리보기:", accessToken.substring(0, 50) + "...");
    }

    alert(
      `🔍 쿠키 디버깅 정보\n\n현재 도메인: ${
        window.location.hostname
      }\n현재 경로: ${window.location.pathname}\nHTTPS: ${
        window.location.protocol === "https:" ? "Yes" : "No"
      }\n\naccess_token: ${
        accessToken ? "존재함" : "없음"
      }\n\n자세한 정보는 콘솔을 확인하세요.`
    );
  };

  /**
   * 1. 현재 로그인된 사용자 ID 확인
   */
  const checkUserId = () => {
    console.log("🔑 사용자 ID 확인 시작...");

    const accessToken = getCookie("access_token");
    console.log("🍪 쿠키에서 가져온 토큰:", accessToken ? "존재함" : "없음");

    if (!accessToken) {
      alert(
        "❌ 로그인이 필요합니다.\n\n1. 먼저 '테스트 로그인' 버튼을 클릭하세요.\n2. 쿠키가 생성되지 않으면 '쿠키 디버깅' 버튼을 클릭하세요."
      );
      setTestResults((prev) => ({ ...prev, userId: "로그인 필요" }));
      return;
    }

    try {
      // JWT 토큰 디코딩 (간단한 디코딩, 실제로는 서버에서 검증)
      const tokenParts = accessToken.split(".");
      if (tokenParts.length !== 3) {
        throw new Error("잘못된 토큰 형식");
      }

      // 안전한 Base64 디코딩 사용
      const payloadStr = safeBase64Decode(tokenParts[1]);
      const payload = JSON.parse(payloadStr);
      const userId = payload.userId;

      setTestResults((prev) => ({ ...prev, userId }));
      setUserInfo(payload);

      // 한글 이름이 있으면 한글로, 없으면 영어로 표시
      const displayName = payload.koreanName || payload.name;
      const displayNickname = payload.koreanNickname || payload.nickname;

      alert(
        `✅ 현재 로그인된 사용자 ID: ${userId}\n이름: ${displayName}\n닉네임: ${displayNickname}\n이메일: ${payload.loginId}`
      );
      console.log("🔑 추출된 사용자 정보:", payload);
    } catch (error) {
      console.error("JWT 디코딩 오류:", error);
      alert(`❌ 토큰 디코딩에 실패했습니다.\n오류: ${error}`);
      setTestResults((prev) => ({ ...prev, userId: "토큰 오류" }));
    }
  };

  /**
   * 2. 영화 ID 확인
   */
  const checkMovieId = () => {
    if (movieId) {
      alert(`✅ 쿼리스트링에서 추출된 영화 ID: ${movieId}`);
      setTestResults((prev) => ({ ...prev, movieId }));
      console.log("🎭 영화 ID 확인:", movieId);
    } else {
      alert(
        "❌ 쿼리스트링에 movieId가 없습니다.\n\nURL 예시: /movie-detail-test?movieId=550"
      );
      console.log("❌ 쿼리스트링에 movieId 파라미터가 없습니다.");
    }
  };

  /**
   * 3. 선택된 날짜 확인
   */
  const checkSelectedDate = () => {
    if (selectedDate) {
      alert(`✅ 선택된 날짜: ${selectedDate}`);
      setTestResults((prev) => ({ ...prev, selectedDate }));
    } else {
      alert("❌ 날짜를 선택해주세요.");
    }
  };

  /**
   * 4. TMDB API에서 포스터 이미지 URL 가져오기
   */
  const checkPosterUrl = async () => {
    if (!movieId) {
      alert("❌ 영화 ID가 필요합니다.\n쿼리스트링에 movieId를 추가하세요.");
      return;
    }

    try {
      console.log(`🖼️ 포스터 정보 요청 시작: movieId=${movieId}`);

      // saves 폴더 내 movie-poster API 엔드포인트 호출
      const response = await fetch(
        `/api/saves/movie-poster?movieId=${movieId}`
      );

      if (!response.ok) {
        throw new Error(
          `API 호출 실패: ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "포스터 정보 조회 실패");
      }

      const data = result.data;
      const posterUrl = data.posterUrl || "포스터 없음";

      setPosterInfo(data);
      setTestResults((prev) => ({ ...prev, posterUrl }));

      alert(
        `✅ 포스터 URL 조회 성공!\n\n영화 제목: ${data.title}\n포스터 URL: ${posterUrl}\n\n📝 상세 정보는 콘솔을 확인하세요.`
      );

      console.log("🖼️ 영화 포스터 정보 조회 성공:", {
        movieId,
        title: data.title,
        posterUrl: data.posterUrl,
        backdropUrl: data.backdropUrl,
        overview: data.overview,
        releaseDate: data.release_date,
      });
    } catch (error) {
      console.error("포스터 정보 가져오기 오류:", error);
      alert(
        `❌ 포스터 정보를 가져올 수 없습니다.\n\n오류: ${error}\n\n💡 .env 파일에 TMDB_API_KEY가 올바르게 설정되었는지 확인하세요.`
      );
      setTestResults((prev) => ({ ...prev, posterUrl: "조회 실패" }));
    }
  };

  /**
   * 캘린더에서 날짜 선택
   */
  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setShowCalendar(false);
    setTestResults((prev) => ({ ...prev, selectedDate: date }));
    alert(`📅 날짜 선택됨: ${date}`);
  };

  /**
   * 영화 저장 실행
   */
  const saveMovie = async () => {
    // 모든 데이터가 준비되었는지 확인
    if (
      !testResults.userId ||
      testResults.userId === "로그인 필요" ||
      testResults.userId === "토큰 오류"
    ) {
      alert("❌ 사용자 ID가 필요합니다.");
      return;
    }
    if (!testResults.movieId) {
      alert("❌ 영화 ID가 필요합니다.\n쿼리스트링에 movieId를 추가하세요.");
      return;
    }
    if (!testResults.selectedDate) {
      alert("❌ 날짜를 선택해주세요.");
      return;
    }

    try {
      const response = await fetch("/api/saves", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          movieId: testResults.movieId,
          selectedDate: testResults.selectedDate,
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert(`🎉 영화 저장 성공!\n${result.message}`);
        console.log("저장된 영화 정보:", result.savedMovie);
      } else {
        alert(`❌ 영화 저장 실패:\n${result.message}`);
      }
    } catch (error) {
      console.error("영화 저장 오류:", error);
      alert("❌ 영화 저장 중 오류가 발생했습니다.");
    }
  };

  // 간단한 캘린더 컴포넌트
  const SimpleCalendar = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // 이번 달의 날짜들 생성
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    const calendarDays = [];

    // 빈 칸 추가 (월의 첫 번째 요일까지)
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarDays.push(null);
    }

    // 날짜들 추가
    for (let day = 1; day <= daysInMonth; day++) {
      calendarDays.push(day);
    }

    return (
      <div className="absolute top-full left-0 mt-2 p-4 bg-white border rounded-lg shadow-lg z-10 min-w-80">
        <div className="text-center font-bold mb-4">
          {currentYear}년 {currentMonth + 1}월
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-sm">
          {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
            <div key={day} className="font-semibold p-2">
              {day}
            </div>
          ))}
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={`p-2 cursor-pointer hover:bg-blue-100 rounded ${
                day ? "text-black" : "text-transparent"
              }`}
              onClick={() => {
                if (day) {
                  const selectedDate = formatDate(
                    new Date(currentYear, currentMonth, day)
                  );
                  handleDateSelect(selectedDate);
                }
              }}
            >
              {day || ""}
            </div>
          ))}
        </div>
        <button
          onClick={() => setShowCalendar(false)}
          className="mt-4 w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
        >
          닫기
        </button>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">
        🎬 영화 저장 시스템 테스트 (쿼리스트링 버전)
      </h1>

      {!movieId && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-yellow-800 mb-2">
            ⚠️ 영화 ID가 필요합니다
          </h2>
          <p className="text-yellow-700">
            URL에 쿼리스트링으로 영화 ID를 추가하세요:
            <br />
            <code className="bg-yellow-100 px-2 py-1 rounded">
              /movie-detail-test?movieId=550
            </code>
          </p>
        </div>
      )}

      <div className="bg-gray-100 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">현재 상태</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>영화 ID:</strong>{" "}
            {testResults.movieId || "쿼리스트링에서 추출 필요"}
          </div>
          <div>
            <strong>사용자 ID:</strong> {testResults.userId || "없음"}
          </div>
          <div>
            <strong>선택된 날짜:</strong> {testResults.selectedDate || "없음"}
          </div>
          <div>
            <strong>포스터 URL:</strong> {testResults.posterUrl || "없음"}
          </div>
        </div>
      </div>

      {/* 테스트 로그인/로그아웃 버튼 */}
      <div className="mb-8 text-center">
        <div className="flex gap-3 justify-center mb-2 flex-wrap">
          <button
            onClick={createTestLoginCookie}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 text-lg font-semibold"
          >
            🍪 테스트 로그인 (쿠키 생성)
          </button>
          <button
            onClick={clearTestLoginCookie}
            className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 text-lg font-semibold"
          >
            🗑️ 로그아웃 (쿠키 삭제)
          </button>
          <button
            onClick={debugCookies}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 text-lg font-semibold"
          >
            🔍 쿠키 디버깅
          </button>
        </div>
        <p className="text-sm text-gray-600">
          ↑ 먼저 테스트 로그인을 클릭하여 쿠키를 생성하세요 (문제 시 디버깅 버튼
          클릭)
        </p>
      </div>

      {/* 캘린더 버튼 */}
      <div className="mb-8 text-center relative">
        <button
          onClick={() => setShowCalendar(!showCalendar)}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 text-lg"
        >
          📅 캘린더 열기
        </button>

        {showCalendar && <SimpleCalendar />}

        {selectedDate && (
          <p className="mt-4 text-green-600 font-semibold">
            선택된 날짜: {selectedDate}
          </p>
        )}
      </div>

      {/* 데이터 확인 버튼들 */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <button
          onClick={checkUserId}
          className="bg-green-500 text-white p-4 rounded-lg hover:bg-green-600"
        >
          🔑 사용자 ID 확인
        </button>

        <button
          onClick={checkMovieId}
          className="bg-purple-500 text-white p-4 rounded-lg hover:bg-purple-600"
        >
          🎭 영화 ID 확인 (쿼리스트링)
        </button>

        <button
          onClick={checkSelectedDate}
          className="bg-yellow-500 text-white p-4 rounded-lg hover:bg-yellow-600"
        >
          📅 선택된 날짜 확인
        </button>

        <button
          onClick={checkPosterUrl}
          className="bg-red-500 text-white p-4 rounded-lg hover:bg-red-600"
        >
          🖼️ 포스터 URL 확인
        </button>
      </div>

      {/* 영화 저장 버튼 */}
      <div className="text-center">
        <button
          onClick={saveMovie}
          className="bg-indigo-600 text-white px-8 py-4 rounded-lg hover:bg-indigo-700 text-lg font-semibold"
        >
          🎬 영화 저장하기
        </button>
      </div>

      {/* 디버그 정보 */}
      <div className="mt-8 bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">디버그 정보:</h3>
        <pre className="text-sm bg-white p-2 rounded overflow-auto">
          {JSON.stringify(
            {
              movieId,
              searchParamsString: searchParams.toString(),
              selectedDate,
              userInfo,
              posterInfo,
              testResults,
            },
            null,
            2
          )}
        </pre>
      </div>
    </div>
  );
}
