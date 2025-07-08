"use client";

import { useState } from "react";
import { convertToGrid } from "../../utils/supabase/recommender/coordinate-converter";
import {
  LocationInfo,
  WeatherInfo,
  WeatherApiResponse,
  AiApiResponse,
  AiWeatherTestState,
} from "./types/ai-weather";

const AiWeatherTest = () => {
  // 컴포넌트 상태 관리
  const [state, setState] = useState<AiWeatherTestState>({
    step: "location",
    location: null,
    weather: null,
    aiResponse: null,
    loading: false,
    error: null,
  });

  /**
   * 1. 위치 정보 얻어오기
   */
  const handleGetLocation = async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      if (!navigator.geolocation) {
        throw new Error("브라우저에서 위치 정보를 지원하지 않습니다.");
      }

      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000, // 5분간 캐시 사용
          });
        }
      );

      const { latitude, longitude } = position.coords;

      // GPS 좌표를 기상청 격자 좌표로 변환
      const gridCoords = convertToGrid(latitude, longitude);

      const locationInfo: LocationInfo = {
        latitude,
        longitude,
        nx: gridCoords.nx,
        ny: gridCoords.ny,
      };

      setState((prev) => ({
        ...prev,
        location: locationInfo,
        step: "weather",
        loading: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error:
          error instanceof Error
            ? error.message
            : "위치 정보를 가져올 수 없습니다.",
        loading: false,
      }));
    }
  };

  /**
   * 2. 날씨 정보 연동
   */
  const handleGetWeather = async () => {
    if (!state.location) return;

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch(
        `/api/weather?nx=${state.location.nx}&ny=${state.location.ny}`
      );

      if (!response.ok) {
        throw new Error(`날씨 정보 조회 실패: ${response.status}`);
      }

      const data: WeatherApiResponse = await response.json();

      if (!data.success || !data.weatherInfo) {
        throw new Error(data.error || "날씨 정보를 가져올 수 없습니다.");
      }

      setState((prev) => ({
        ...prev,
        weather: data.weatherInfo!,
        step: "ai",
        loading: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error:
          error instanceof Error
            ? error.message
            : "날씨 정보 조회에 실패했습니다.",
        loading: false,
      }));
    }
  };

  /**
   * 3. AI 연동 (영화 추천)
   */
  const handleAiRecommendation = async () => {
    if (!state.weather) return;

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      // AI 프롬프트 생성
      const prompt = createMovieRecommendationPrompt(state.weather);

      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          temperature: 0.7,
          max_tokens: 4096, // thinking 모드를 고려해서 대폭 증가
        }),
      });

      if (!response.ok) {
        throw new Error(`AI 요청 실패: ${response.status}`);
      }

      const data: AiApiResponse = await response.json();

      if (!data.success || !data.data?.text) {
        throw new Error(data.error || "AI 응답을 받을 수 없습니다.");
      }

      setState((prev) => ({
        ...prev,
        aiResponse: data.data!.text,
        step: "result",
        loading: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error:
          error instanceof Error ? error.message : "AI 요청에 실패했습니다.",
        loading: false,
      }));
    }
  };

  /**
   * AI 프롬프트 생성 함수
   */
  const createMovieRecommendationPrompt = (weather: WeatherInfo): string => {
    const temp = weather.currentTemp ? `${weather.currentTemp}°C` : "정보 없음";
    const humidity = weather.humidity ? `${weather.humidity}%` : "정보 없음";
    const feelsLike = weather.feelsLikeTemp
      ? `${weather.feelsLikeTemp}°C`
      : "정보 없음";

    return `현재온도와 습도, 체감온도는 현재온도: ${temp}, 습도: ${humidity}, 체감온도: ${feelsLike}인데, 이것에 기반해서 영화 추천해줘. 그리고 추천한 이유에 대해 각각 설명하지말고 전체적인 이유를 2~3줄로 짧게 설명해. 리스트는 10개까지만. 그리고 응답 형태는 다음같이 말해
[영화제목1, 영화제목2, 영화제목3, 영화제목4, 영화제목5, 영화제목6, 영화제목7, 영화제목8, 영화제목9, 영화제목10]`;
  };

  /**
   * 다시 시작하기
   */
  const handleReset = () => {
    setState({
      step: "location",
      location: null,
      weather: null,
      aiResponse: null,
      loading: false,
      error: null,
    });
  };

  return (
    <div className="space-y-6">
      {/* 에러 메시지 */}
      {state.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">❌ {state.error}</p>
        </div>
      )}

      {/* 1단계: 위치 정보 얻기 */}
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3">📍 1단계: 위치 정보 얻기</h3>
        <div className="flex items-center justify-between">
          <div>
            {state.location ? (
              <div className="text-sm text-gray-600">
                <p>
                  ✅ 위치: {state.location.latitude.toFixed(4)},{" "}
                  {state.location.longitude.toFixed(4)}
                </p>
                <p>
                  격자 좌표: ({state.location.nx}, {state.location.ny})
                </p>
              </div>
            ) : (
              <p className="text-gray-500">위치 정보를 가져와주세요</p>
            )}
          </div>
          <button
            onClick={handleGetLocation}
            disabled={state.loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
          >
            {state.loading && state.step === "location"
              ? "위치 확인 중..."
              : "위치 정보 얻기"}
          </button>
        </div>
      </div>

      {/* 2단계: 날씨 정보 연동 */}
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3">🌤️ 2단계: 날씨 정보 연동</h3>
        <div className="flex items-center justify-between">
          <div>
            {state.weather ? (
              <div className="text-sm text-gray-600">
                <p>✅ 현재 온도: {state.weather.currentTemp}°C</p>
                <p>체감 온도: {state.weather.feelsLikeTemp}°C</p>
                <p>습도: {state.weather.humidity}%</p>
                <p>날씨: {state.weather.weatherDescription}</p>
              </div>
            ) : (
              <p className="text-gray-500">날씨 정보를 가져와주세요</p>
            )}
          </div>
          <button
            onClick={handleGetWeather}
            disabled={!state.location || state.loading}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300"
          >
            {state.loading && state.step === "weather"
              ? "날씨 조회 중..."
              : "연동하기"}
          </button>
        </div>
      </div>

      {/* 3단계: AI 연동 */}
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3">🤖 3단계: AI 영화 추천</h3>
        <div className="flex items-center justify-between">
          <div>
            {state.aiResponse ? (
              <p className="text-sm text-gray-600">✅ AI 추천 완료</p>
            ) : (
              <p className="text-gray-500">AI에게 영화 추천을 요청해주세요</p>
            )}
          </div>
          <button
            onClick={handleAiRecommendation}
            disabled={!state.weather || state.loading}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:bg-gray-300"
          >
            {state.loading && state.step === "ai" ? "AI 처리 중..." : "AI연동"}
          </button>
        </div>
      </div>

      {/* 4단계: 결과 표시 */}
      {state.aiResponse && (
        <div className="border rounded-lg p-4 bg-yellow-50">
          <h3 className="text-lg font-semibold mb-3">🎬 4단계: AI 추천 결과</h3>
          <div className="bg-white p-4 rounded border">
            <pre className="whitespace-pre-wrap text-sm text-gray-700">
              {state.aiResponse}
            </pre>
          </div>
          <div className="mt-4 text-center">
            <button
              onClick={handleReset}
              className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              🔄 다시 시작하기
            </button>
          </div>
        </div>
      )}

      {/* 로딩 인디케이터 */}
      {state.loading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600">처리 중...</p>
        </div>
      )}
    </div>
  );
};

export default AiWeatherTest;
