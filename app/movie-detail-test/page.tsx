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
    return btoa(unescape(encodeURIComponent(str)));
  } catch {
    const safeStr = JSON.stringify(str).replace(/[^\x00-\x7F]/g, "");
    return btoa(safeStr);
  }
};

// 쿠키 설정하는 함수
const setCookie = (name: string, value: string, days: number = 1): void => {
  if (typeof document === "undefined") return;

  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

  document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
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
    }
  }, [movieId]);

  /**
   * 임시 로그인 쿠키 생성 (테스트용)
   */
  const createTestLoginCookie = () => {
    try {
      const testUser = {
        userId: "test-user-123",
        name: "Test User",
        loginId: "test@example.com",
        nickname: "Tester",
        role: "user",
        koreanName: "테스트 사용자",
        koreanNickname: "테스터",
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
      };

      const header = safeBase64Encode(
        JSON.stringify({ alg: "HS256", typ: "JWT" })
      );
      const payload = safeBase64Encode(JSON.stringify(testUser));
      const signature = "test-signature";

      const testToken = `${header}.${payload}.${signature}`;

      setCookie("access_token", testToken, 1);

      setUserInfo(testUser);
      setTestResults((prev) => ({ ...prev, userId: testUser.userId }));

      alert(`✅ 테스트 로그인 쿠키 생성 완료!\n사용자 ID: ${testUser.userId}`);
    } catch (error) {
      alert(`❌ 테스트 로그인 쿠키 생성에 실패했습니다.\n오류: ${error}`);
    }
  };

  /**
   * 1. 백엔드 API를 통해 사용자 ID 확인
   */
  const checkUserId = async () => {
    try {
      const response = await fetch("/api/saves/user-auth");
      const result = await response.json();

      if (result.success) {
        const { userId, loginId, name, nickname } = result.data;
        setTestResults((prev) => ({ ...prev, userId }));
        setUserInfo(result.data);

        alert(
          `✅ 현재 로그인된 사용자 ID: ${userId}\n이름: ${name}\n닉네임: ${nickname}\n이메일: ${loginId}`
        );
      } else {
        alert(`❌ 사용자 인증 실패: ${result.error}`);
        setTestResults((prev) => ({ ...prev, userId: "인증 실패" }));
      }
    } catch (error) {
      alert(`❌ 사용자 ID 확인 중 오류가 발생했습니다.\n오류: ${error}`);
      setTestResults((prev) => ({ ...prev, userId: "오류 발생" }));
    }
  };

  /**
   * 2. 영화 ID 확인
   */
  const checkMovieId = () => {
    if (movieId) {
      alert(`✅ 쿼리스트링에서 추출된 영화 ID: ${movieId}`);
      setTestResults((prev) => ({ ...prev, movieId }));
    } else {
      alert(
        "❌ 쿼리스트링에 movieId가 없습니다.\n\nURL 예시: /movie-detail-test?movieId=550"
      );
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
   * 4. 백엔드 API를 통해 TMDB에서 포스터 이미지 URL 가져오기
   */
  const checkPosterUrl = async () => {
    if (!movieId) {
      alert("❌ 영화 ID가 필요합니다.\n쿼리스트링에 movieId를 추가하세요.");
      return;
    }

    try {
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
        `✅ 포스터 URL 조회 성공!\n\n영화 제목: ${data.title}\n포스터 URL: ${posterUrl}`
      );
    } catch (error) {
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
    if (
      !testResults.userId ||
      testResults.userId === "인증 실패" ||
      testResults.userId === "오류 발생"
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
      } else {
        alert(`❌ 영화 저장 실패:\n${result.message}`);
      }
    } catch {
      alert("❌ 영화 저장 중 오류가 발생했습니다.");
    }
  };

  // 간단한 캘린더 컴포넌트
  const SimpleCalendar = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    const calendarDays = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarDays.push(null);
    }

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
        🎬 영화 저장 시스템 테스트 (클린 아키텍처)
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

      {/* 테스트 로그인 버튼 */}
      <div className="mb-8 text-center">
        <button
          onClick={createTestLoginCookie}
          className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 text-lg font-semibold"
        >
          🍪 테스트 로그인 (쿠키 생성)
        </button>
        <p className="text-sm text-gray-600 mt-2">
          ↑ 먼저 테스트 로그인을 클릭하여 쿠키를 생성하세요
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
          🔑 사용자 ID 확인 (백엔드 API)
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
          🖼️ 포스터 URL 확인 (백엔드 API)
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
