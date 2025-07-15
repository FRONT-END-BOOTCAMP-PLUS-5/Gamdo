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

export default function MovieDetailTestPage() {
  const searchParams = useSearchParams();
  const movieId = searchParams.get("movieId");

  // 상태 관리
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [apiResults, setApiResults] = useState<{
    login: unknown;
    tokenInfo: unknown;
    userInfo: unknown;
    movieInfo: unknown;
    saveResult: unknown;
  }>({
    login: null,
    tokenInfo: null,
    userInfo: null,
    movieInfo: null,
    saveResult: null,
  });

  // 컴포넌트 마운트 시 영화 ID 표시
  useEffect(() => {
    if (movieId) {
      console.log("영화 ID:", movieId);
    }
  }, [movieId]);

  /**
   * 1. 테스트 로그인
   */
  const testLogin = async () => {
    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          loginId: "test02@example.com",
          password: "testpassword123!",
        }),
      });

      const result = await response.json();
      setApiResults((prev) => ({ ...prev, login: result }));

      if (response.ok && result.result?.success) {
        alert("✅ 로그인 성공!");
      } else {
        alert(`❌ 로그인 실패: ${result.error || result.result?.message}`);
      }
    } catch (error) {
      alert(`❌ 로그인 중 오류: ${error}`);
    }
  };

  /**
   * 2. JWT 토큰 정보 확인
   */
  const checkTokenInfo = async () => {
    try {
      const response = await fetch("/api/saves/user-auth");
      const result = await response.json();

      setApiResults((prev) => ({ ...prev, tokenInfo: result }));

      if (result.success) {
        alert(`✅ 토큰 정보 확인 성공!\n사용자 ID: ${result.data.userId}`);
      } else {
        alert(`❌ 토큰 확인 실패: ${result.error}`);
      }
    } catch (error) {
      alert(`❌ 토큰 확인 중 오류: ${error}`);
    }
  };

  /**
   * 3. 사용자 ID 확인
   */
  const checkUserId = async () => {
    try {
      const response = await fetch("/api/saves/user-auth");
      const result = await response.json();

      setApiResults((prev) => ({ ...prev, userInfo: result }));

      if (result.success) {
        alert(`✅ 사용자 ID 확인 성공: ${result.data.userId}`);
      } else {
        alert(`❌ 사용자 ID 확인 실패: ${result.error}`);
      }
    } catch (error) {
      alert(`❌ 사용자 ID 확인 중 오류: ${error}`);
    }
  };

  /**
   * 4. 영화 정보 확인
   */
  const checkMovieInfo = async () => {
    if (!movieId) {
      alert("❌ 영화 ID가 필요합니다.");
      return;
    }

    try {
      const response = await fetch(`/api/saves/movie-info?movieId=${movieId}`);
      const result = await response.json();

      setApiResults((prev) => ({ ...prev, movieInfo: result }));

      if (result.success) {
        alert(`✅ 영화 정보 확인 성공!\n제목: ${result.data.title}`);
      } else {
        alert(`❌ 영화 정보 확인 실패: ${result.error}`);
      }
    } catch (error) {
      alert(`❌ 영화 정보 확인 중 오류: ${error}`);
    }
  };

  /**
   * 5. 영화 저장
   */
  const saveMovie = async () => {
    if (!movieId) {
      alert("❌ 영화 ID가 필요합니다.");
      return;
    }
    if (!selectedDate) {
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
          movieId,
          selectedDate,
        }),
      });

      const result = await response.json();
      setApiResults((prev) => ({ ...prev, saveResult: result }));

      if (result.success) {
        alert(`✅ 영화 저장 성공!`);
      } else {
        alert(`❌ 영화 저장 실패: ${result.message}`);
      }
    } catch (error) {
      alert(`❌ 영화 저장 중 오류: ${error}`);
    }
  };

  /**
   * 캘린더에서 날짜 선택
   */
  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setShowCalendar(false);
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
        🎬 영화 저장 API 테스트
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
        <h2 className="text-xl font-semibold mb-4">테스트 정보</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>영화 ID:</strong> {movieId || "없음"}
          </div>
          <div>
            <strong>선택된 날짜:</strong> {selectedDate || "없음"}
          </div>
        </div>
      </div>

      {/* API 테스트 버튼들 */}
      <div className="space-y-4 mb-8">
        <button
          onClick={testLogin}
          className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 text-lg font-semibold"
        >
          🔑 1. 테스트 로그인
        </button>

        <button
          onClick={checkTokenInfo}
          className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 text-lg font-semibold"
        >
          🔍 2. JWT 토큰 정보 확인
        </button>

        <button
          onClick={checkUserId}
          className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 text-lg font-semibold"
        >
          👤 3. 사용자 ID 확인
        </button>

        <button
          onClick={checkMovieInfo}
          className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 text-lg font-semibold"
          disabled={!movieId}
        >
          🎬 4. 영화 정보 확인
        </button>

        {/* 캘린더 */}
        <div className="relative">
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className="w-full bg-purple-500 text-white py-3 rounded-lg hover:bg-purple-600 text-lg font-semibold"
          >
            📅 5. 날짜 선택
          </button>
          {showCalendar && <SimpleCalendar />}
          {selectedDate && (
            <p className="mt-2 text-center text-green-600 font-semibold">
              선택된 날짜: {selectedDate}
            </p>
          )}
        </div>

        <button
          onClick={saveMovie}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 text-lg font-semibold"
          disabled={!movieId || !selectedDate}
        >
          💾 6. 영화 저장하기
        </button>
      </div>

      {/* API 응답 결과 */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">API 응답 결과:</h3>
        <pre className="text-sm bg-white p-2 rounded overflow-auto max-h-96">
          {JSON.stringify(apiResults, null, 2)}
        </pre>
      </div>
    </div>
  );
}
