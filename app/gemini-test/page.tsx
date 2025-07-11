"use client";

import { useState } from "react";
import { WeatherApiResponse } from "../../backend/domain/entities/recommender/weather";
import { GeminiClientApiResponse } from "../../backend/domain/entities/recommender/gemini";
import { GeminiWeatherTestState } from "../../backend/application/recommender/GetGeminiResponseUseCase";
import { getUserLocationService } from "../../backend/application/recommender/GetUserLocationUseCase";
import { RecommendedMovie } from "../../backend/domain/entities/recommender/movie";
import {
  SearchResult,
  MovieOrTvResult,
} from "../../backend/domain/entities/SearchResult";

// ==================== 확장 가능한 사용자 선호도 카테고리 설정 ====================

/**
 * 선택 옵션 타입 정의
 */
interface SelectionOption {
  value: string;
  label: string;
  description?: string;
}

/**
 * 사용자 선호도 카테고리 타입 정의
 */
interface UserPreferenceCategory {
  id: string;
  name: string;
  description: string;
  required: boolean;
  options: SelectionOption[];
  defaultValue?: string;
}

/**
 * 사용자 선택 정보 타입 (동적으로 생성)
 */
type UserSelectionInfo = {
  [key: string]: string;
};

/**
 * 기분 선택 옵션
 */
const MOOD_OPTIONS: SelectionOption[] = [
  {
    value: "happy",
    label: "😊 행복한 기분",
    description: "즐겁고 밝은 기분일 때",
  },
  {
    value: "sad",
    label: "😢 슬픈 기분",
    description: "우울하거나 감정적인 기분일 때",
  },
  {
    value: "excited",
    label: "🎉 신나는 기분",
    description: "활기차고 흥미진진한 기분일 때",
  },
  {
    value: "relaxed",
    label: "😌 편안한 기분",
    description: "평온하고 안정적인 기분일 때",
  },
  {
    value: "romantic",
    label: "💕 로맨틱한 기분",
    description: "사랑스럽고 로맨틱한 기분일 때",
  },
  {
    value: "adventurous",
    label: "🗺️ 모험적인 기분",
    description: "새로운 것을 시도하고 싶은 기분일 때",
  },
  {
    value: "nostalgic",
    label: "🕰️ 그리운 기분",
    description: "과거를 그리워하는 기분일 때",
  },
  {
    value: "mysterious",
    label: "🔮 신비로운 기분",
    description: "신비롭고 몽환적인 기분일 때",
  },
];

/**
 * 시간대 선택 옵션
 */
const TIME_OPTIONS: SelectionOption[] = [
  {
    value: "morning",
    label: "🌅 아침 시간",
    description: "상쾌한 아침 시간대",
  },
  {
    value: "afternoon",
    label: "🌞 오후 시간",
    description: "활동적인 오후 시간대",
  },
  {
    value: "evening",
    label: "🌆 저녁 시간",
    description: "여유로운 저녁 시간대",
  },
  { value: "night", label: "🌙 밤 시간", description: "조용한 밤 시간대" },
  {
    value: "weekend",
    label: "🎉 주말 시간",
    description: "휴식을 위한 주말 시간",
  },
  {
    value: "date",
    label: "💕 데이트 시간",
    description: "특별한 사람과의 시간",
  },
];

/**
 * 장르 선택 옵션
 */
const GENRE_OPTIONS: SelectionOption[] = [
  { value: "action", label: "🎬 액션", description: "스릴 넘치는 액션 영화" },
  {
    value: "comedy",
    label: "😂 코미디",
    description: "유쾌하고 재미있는 코미디 영화",
  },
  {
    value: "drama",
    label: "🎭 드라마",
    description: "감동적이고 진지한 드라마",
  },
  {
    value: "romance",
    label: "💕 로맨스",
    description: "사랑스러운 로맨스 영화",
  },
  {
    value: "thriller",
    label: "😱 스릴러",
    description: "긴장감 넘치는 스릴러",
  },
  { value: "horror", label: "👻 호러", description: "무서운 호러 영화" },
  { value: "fantasy", label: "🧙‍♂️ 판타지", description: "환상적인 판타지 영화" },
  { value: "sci-fi", label: "🚀 SF", description: "미래적인 SF 영화" },
  {
    value: "animation",
    label: "🎨 애니메이션",
    description: "따뜻한 애니메이션 영화",
  },
  {
    value: "documentary",
    label: "📽️ 다큐멘터리",
    description: "교육적인 다큐멘터리",
  },
];

/**
 * 함께 볼 사람 선택 옵션 (확장 예시)
 */
const COMPANION_OPTIONS: SelectionOption[] = [
  { value: "alone", label: "👤 혼자서", description: "혼자 조용히 감상" },
  { value: "couple", label: "💑 연인과", description: "연인과 함께 감상" },
  { value: "family", label: "👨‍👩‍👧‍👦 가족과", description: "가족과 함께 감상" },
  { value: "friends", label: "👥 친구들과", description: "친구들과 함께 감상" },
];

/**
 * 연령대 선택 옵션 (확장 예시)
 */
const AGE_GROUP_OPTIONS: SelectionOption[] = [
  { value: "teenager", label: "👦 10대", description: "10대에 적합한 영화" },
  { value: "twenties", label: "🧑 20대", description: "20대에 적합한 영화" },
  { value: "thirties", label: "👨 30대", description: "30대에 적합한 영화" },
  { value: "forties", label: "👨‍💼 40대", description: "40대에 적합한 영화" },
  {
    value: "fifties_plus",
    label: "👨‍🦳 50대+",
    description: "50대 이상에 적합한 영화",
  },
];

/**
 * 🚀 사용자 선호도 카테고리 정의
 *
 * ✅ 새로운 카테고리 추가 방법:
 * 1. 위에 새로운 OPTIONS 배열을 추가하고
 * 2. 아래 USER_PREFERENCE_CATEGORIES 배열에 새로운 객체를 추가하면 됩니다!
 * 3. 별도의 코드 수정 없이 자동으로 UI에 반영됩니다.
 */
const USER_PREFERENCE_CATEGORIES: UserPreferenceCategory[] = [
  // 🔴 필수 카테고리
  {
    id: "mood",
    name: "현재 기분",
    description: "현재 기분을 선택해주세요",
    required: true,
    options: MOOD_OPTIONS,
  },
  {
    id: "time",
    name: "시청 시간대",
    description: "시청 시간대를 선택해주세요",
    required: true,
    options: TIME_OPTIONS,
  },
  {
    id: "genre",
    name: "선호 장르",
    description: "선호 장르를 선택해주세요",
    required: true,
    options: GENRE_OPTIONS,
  },
  // 🔵 선택 카테고리 (확장 가능)
  {
    id: "companion",
    name: "함께 볼 사람",
    description: "누구와 함께 볼 예정인가요?",
    required: false,
    options: COMPANION_OPTIONS,
    defaultValue: "alone",
  },
  {
    id: "age_group",
    name: "연령대",
    description: "연령대를 선택해주세요",
    required: false,
    options: AGE_GROUP_OPTIONS,
    defaultValue: "twenties",
  },

  // 💡 새로운 카테고리 추가 예시:
  // {
  //   id: "duration",
  //   name: "영화 길이",
  //   description: "선호하는 영화 길이를 선택해주세요",
  //   required: false,
  //   options: [
  //     { value: "short", label: "⏱️ 짧게 (90분 이하)", description: "짧고 간결한 영화" },
  //     { value: "medium", label: "🎬 보통 (90-120분)", description: "적당한 길이의 영화" },
  //     { value: "long", label: "🎭 길게 (120분 이상)", description: "긴 몰입형 영화" },
  //     { value: "any", label: "🎯 상관없음", description: "길이에 상관없이" },
  //   ],
  //   defaultValue: "any",
  // },
];

/**
 * 헬퍼 함수들
 */
const getCategoryOptionText = (categoryId: string, value: string): string => {
  const category = USER_PREFERENCE_CATEGORIES.find(
    (cat) => cat.id === categoryId
  );
  if (!category) return value;

  const option = category.options.find((opt) => opt.value === value);
  return option ? option.label : value;
};

const getRequiredCategoryIds = (): string[] => {
  return USER_PREFERENCE_CATEGORIES.filter((cat) => cat.required).map(
    (cat) => cat.id
  );
};

const initializeUserSelection = (): UserSelectionInfo => {
  const selection: UserSelectionInfo = {};

  USER_PREFERENCE_CATEGORIES.forEach((category) => {
    selection[category.id] = category.defaultValue || "";
  });

  return selection;
};

const validateUserSelection = (selection: UserSelectionInfo): boolean => {
  const requiredIds = getRequiredCategoryIds();

  return requiredIds.every(
    (id) => selection[id] && selection[id].trim().length > 0
  );
};

// ==================== 기존 코드 ====================

// 확장된 상태 타입
interface ExtendedGeminiWeatherTestState extends GeminiWeatherTestState {
  userSelection: UserSelectionInfo | null;
}

// UI 컴포넌트 (비즈니스 로직은 GetGeminiResponseUseCase에서 가져옴)
const GeminiWeatherComponent = () => {
  const [state, setState] = useState<ExtendedGeminiWeatherTestState>({
    step: "location",
    location: null,
    weather: null,
    userSelection: null,
    geminiResponse: null,
    movieTitles: [],
    movieResults: [],
    loading: false,
    error: null,
  });

  /**
   * AI 응답에서 영화 제목을 추출합니다
   */
  const extractMovieTitles = (aiResponse: string): string[] => {
    // 임시로 직접 구현 (GeminiService 로직 복사)
    try {
      const bracketMatch = aiResponse.match(/\[([^\]]+)\]/);

      if (!bracketMatch) {
        const lines = aiResponse.split("\n");
        const movieTitles: string[] = [];

        for (const line of lines) {
          const trimmedLine = line.trim();
          const numberMatch = trimmedLine.match(/^\d+\.\s*(.+)/);
          const dashMatch = trimmedLine.match(/^-\s*(.+)/);

          if (numberMatch) {
            movieTitles.push(numberMatch[1].trim());
          } else if (dashMatch) {
            movieTitles.push(dashMatch[1].trim());
          }
        }

        return movieTitles.length > 0 ? movieTitles : [];
      }

      const movieTitles = bracketMatch[1]
        .split(",")
        .map((title) => title.trim())
        .filter((title) => title.length > 0);

      return movieTitles
        .map((title) => {
          return title
            .replace(/["""'']/g, "") // 따옴표 제거
            .replace(/\([^)]*\)/g, "") // 괄호와 괄호 안 내용 제거
            .replace(/\[[^\]]*\]/g, "") // 대괄호와 대괄호 안 내용 제거
            .trim();
        })
        .filter((title) => title.length > 0);
    } catch (error) {
      console.error("영화 제목 파싱 중 오류:", error);
      return [];
    }
  };

  /**
   * 영화 제목들을 검색하여 포스터 정보를 가져옵니다 (팀원의 API 사용)
   */
  const handleMovieSearch = async (movieTitles: string[]) => {
    setState((prev) => ({ ...prev, loading: true }));

    try {
      console.log("🎬 팀원 API 사용: 영화 검색 시작", movieTitles);

      // 각 영화 제목에 대해 팀원의 API를 사용하여 검색
      const movieResults: RecommendedMovie[] = [];

      for (const title of movieTitles) {
        const recommendedMovie: RecommendedMovie = {
          title,
          searchStatus: "searching",
        };

        try {
          // 팀원의 영화 검색 API 호출
          const response = await fetch(
            `/api/movie/search?query=${encodeURIComponent(title)}&page=1`
          );

          if (!response.ok) {
            throw new Error(`API 호출 실패: ${response.status}`);
          }

          const searchData = await response.json();

          // 영화만 필터링 (TV 프로그램, 인물 제외)
          const movieResults = searchData.results.filter(
            (item: SearchResult) => item.media_type === "movie"
          ) as MovieOrTvResult[];

          if (movieResults.length > 0) {
            const movie = movieResults[0];

            // 영화 정보 저장
            recommendedMovie.movieInfo = {
              id: movie.id,
              title: movie.title || movie.name || "제목 없음",
              originalTitle: movie.title || movie.name || "제목 없음",
              overview: movie.overview || "",
              releaseDate: movie.release_date || "",
              posterPath: movie.poster_path || null,
              backdropPath: movie.backdrop_path || null,
              voteAverage: 0,
              voteCount: 0,
              popularity: 0,
              adult: false,
              genreIds: movie.genre_ids || [],
              originalLanguage: "ko",
            };

            // 포스터 URL 생성
            if (movie.poster_path) {
              const baseUrl = "https://image.tmdb.org/t/p/";
              const size = "w500";
              recommendedMovie.posterUrl = `${baseUrl}${size}${movie.poster_path}`;
            }

            recommendedMovie.searchStatus = "found";
          } else {
            recommendedMovie.searchStatus = "not_found";
          }
        } catch (error) {
          console.error(`영화 검색 오류 (${title}):`, error);
          recommendedMovie.searchStatus = "error";
          recommendedMovie.error =
            error instanceof Error
              ? error.message
              : "영화 정보 검색 중 오류가 발생했습니다.";
        }

        movieResults.push(recommendedMovie);
      }

      console.log("🎬 팀원 API: 영화 검색 완료", movieResults);

      setState((prev) => ({
        ...prev,
        movieResults,
        loading: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error:
          error instanceof Error
            ? error.message
            : "영화 검색 중 오류가 발생했습니다.",
        loading: false,
      }));
    }
  };

  /**
   * 1. 위치 정보 얻어오기 (GetUserLocationUseCase 사용)
   */
  const handleGetLocation = async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    const result = await getUserLocationService.getCurrentLocation();

    if (result.success && result.data) {
      setState((prev) => ({
        ...prev,
        location: result.data!,
        step: "weather",
        loading: false,
      }));
    } else {
      setState((prev) => ({
        ...prev,
        error: result.error || "위치 정보를 가져올 수 없습니다.",
        loading: false,
      }));
    }
  };

  /**
   * 사용자 선택 정보 업데이트
   */
  const handleUserSelectionChange = (categoryId: string, value: string) => {
    setState((prev) => ({
      ...prev,
      userSelection: {
        ...prev.userSelection!,
        [categoryId]: value,
      },
    }));
  };

  /**
   * 사용자 선택 단계 완료
   */
  const handleUserSelectionComplete = () => {
    if (state.userSelection && validateUserSelection(state.userSelection)) {
      setState((prev) => ({
        ...prev,
        step: "gemini",
      }));
    }
  };

  /**
   * 사용자 선택 단계 시작
   */
  const handleStartUserSelection = () => {
    setState((prev) => ({
      ...prev,
      userSelection: initializeUserSelection(),
      step: "user_selection",
    }));
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
        step: "weather_complete",
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
   * 3. Gemini 연동 (영화 추천) - 사용자 선택 정보 포함
   */
  const handleGeminiRecommendation = async () => {
    if (!state.weather || !state.userSelection) return;

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      // 사용자 선택 정보를 텍스트로 변환하여 API로 전송
      const userPreferences = Object.entries(state.userSelection)
        .map(([categoryId, value]) => {
          const category = USER_PREFERENCE_CATEGORIES.find(
            (cat) => cat.id === categoryId
          );
          const categoryName = category ? category.name : categoryId;
          const optionText = getCategoryOptionText(categoryId, value);
          return `${categoryName}: ${optionText}`;
        })
        .join(", ");

      // 날씨 정보 포맷팅
      const temp = state.weather.currentTemp
        ? `${state.weather.currentTemp}°C`
        : "정보 없음";
      const humidity = state.weather.humidity
        ? `${state.weather.humidity}%`
        : "정보 없음";
      const feelsLike = state.weather.feelsLikeTemp
        ? `${state.weather.feelsLikeTemp}°C`
        : "정보 없음";

      // 향상된 프롬프트 생성
      const prompt = `현재 날씨 정보: 온도 ${temp}, 습도 ${humidity}, 체감온도 ${feelsLike}
사용자 선호 정보: ${userPreferences}

위 정보를 바탕으로 최적의 영화 10개를 추천해주세요. 
- 날씨와 사용자의 모든 선호 정보를 종합적으로 고려해주세요
- 추천 이유는 2-3줄로 간단히 설명해주세요
- 영화 제목은 다음 형식으로 응답해주세요:

[영화제목1, 영화제목2, 영화제목3, 영화제목4, 영화제목5, 영화제목6, 영화제목7, 영화제목8, 영화제목9, 영화제목10]`;

      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          temperature: 0.7,
          max_tokens: 4096,
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini 요청 실패: ${response.status}`);
      }

      const data: GeminiClientApiResponse = await response.json();

      if (!data.success || !data.data?.text) {
        throw new Error(data.error || "Gemini 응답을 받을 수 없습니다.");
      }

      setState((prev) => ({
        ...prev,
        geminiResponse: data.data!.text,
        step: "result",
        loading: false,
      }));

      // AI 응답에서 영화 제목 추출
      const movieTitles = extractMovieTitles(data.data!.text);

      if (movieTitles.length > 0) {
        setState((prev) => ({
          ...prev,
          movieTitles,
          step: "movies",
        }));

        // 영화 정보 검색 시작
        await handleMovieSearch(movieTitles);
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error:
          error instanceof Error
            ? error.message
            : "Gemini 요청에 실패했습니다.",
        loading: false,
      }));
    }
  };

  const handleReset = () => {
    setState({
      step: "location",
      location: null,
      weather: null,
      userSelection: null,
      geminiResponse: null,
      movieTitles: [],
      movieResults: [],
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

      {/* 2.5단계: 사용자 선택 UI */}
      {state.step === "weather_complete" && (
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3">
            🎯 2.5단계: 선호도 선택
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">
                영화 추천을 위한 선호도를 선택해주세요
              </p>
              <p className="text-sm text-gray-400 mt-1">
                현재 {USER_PREFERENCE_CATEGORIES.length}개의 카테고리가
                있습니다.
              </p>
            </div>
            <button
              onClick={handleStartUserSelection}
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
            >
              선호도 선택하기
            </button>
          </div>
        </div>
      )}

      {/* 사용자 선택 UI - 동적으로 생성 */}
      {state.step === "user_selection" && (
        <div className="border rounded-lg p-4 bg-orange-50">
          <h3 className="text-lg font-semibold mb-4">🎯 선호도 선택</h3>

          {/* 필수 카테고리 */}
          <div className="mb-6">
            <h4 className="text-md font-medium mb-3 text-red-700">
              🔴 필수 항목
            </h4>
            {USER_PREFERENCE_CATEGORIES.filter((cat) => cat.required).map(
              (category) => (
                <div key={category.id} className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    {category.description}
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {category.options.map((option) => (
                      <button
                        key={option.value}
                        onClick={() =>
                          handleUserSelectionChange(category.id, option.value)
                        }
                        className={`p-2 text-sm rounded border ${
                          state.userSelection?.[category.id] === option.value
                            ? "bg-red-500 text-white border-red-500"
                            : "bg-white border-gray-300 hover:bg-gray-50"
                        }`}
                        title={option.description}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>

          {/* 선택적 카테고리 */}
          <div className="mb-6">
            <h4 className="text-md font-medium mb-3 text-blue-700">
              🔵 선택 항목 (더 정확한 추천을 위해)
            </h4>
            {USER_PREFERENCE_CATEGORIES.filter((cat) => !cat.required).map(
              (category) => (
                <div key={category.id} className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    {category.description}
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {category.options.map((option) => (
                      <button
                        key={option.value}
                        onClick={() =>
                          handleUserSelectionChange(category.id, option.value)
                        }
                        className={`p-2 text-sm rounded border ${
                          state.userSelection?.[category.id] === option.value
                            ? "bg-blue-500 text-white border-blue-500"
                            : "bg-white border-gray-300 hover:bg-gray-50"
                        }`}
                        title={option.description}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>

          {/* 선택 완료 버튼 */}
          <div className="flex justify-end">
            <button
              onClick={handleUserSelectionComplete}
              disabled={
                !state.userSelection ||
                !validateUserSelection(state.userSelection)
              }
              className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:bg-gray-300"
            >
              선택 완료
            </button>
          </div>
        </div>
      )}

      {/* 데이터 검증 UI */}
      {state.step === "gemini" && state.weather && state.userSelection && (
        <div className="border rounded-lg p-4 bg-blue-50">
          <h3 className="text-lg font-semibold mb-3">📊 수집된 데이터 확인</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-white p-3 rounded">
              <h4 className="font-medium mb-2">🌤️ 날씨 정보</h4>
              <ul className="text-sm text-gray-600">
                <li>온도: {state.weather.currentTemp}°C</li>
                <li>체감온도: {state.weather.feelsLikeTemp}°C</li>
                <li>습도: {state.weather.humidity}%</li>
                <li>날씨: {state.weather.weatherDescription}</li>
              </ul>
            </div>
            <div className="bg-white p-3 rounded">
              <h4 className="font-medium mb-2">🎯 사용자 선택</h4>
              <ul className="text-sm text-gray-600">
                {Object.entries(state.userSelection).map(
                  ([categoryId, value]) => (
                    <li key={categoryId}>
                      {
                        USER_PREFERENCE_CATEGORIES.find(
                          (cat) => cat.id === categoryId
                        )?.name
                      }
                      : {getCategoryOptionText(categoryId, value)}
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              ✅ 모든 데이터가 정상적으로 수집되었습니다. Gemini AI에 영화
              추천을 요청할 수 있습니다.
            </p>
            <button
              onClick={handleGeminiRecommendation}
              disabled={state.loading}
              className="px-6 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:bg-gray-300"
            >
              {state.loading ? "Gemini 처리 중..." : "🤖 AI 영화 추천 받기"}
            </button>
          </div>
        </div>
      )}

      {/* 4단계: 결과 표시 */}
      {state.geminiResponse && (
        <div className="border rounded-lg p-4 bg-yellow-50">
          <h3 className="text-lg font-semibold mb-3">
            🎬 4단계: Gemini 추천 결과
          </h3>
          <div className="bg-white p-4 rounded border">
            <pre className="whitespace-pre-wrap text-sm text-gray-700">
              {state.geminiResponse}
            </pre>
          </div>

          {/* 영화 제목 표시 */}
          {state.movieTitles.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold mb-2">📝 추출된 영화 제목:</h4>
              <div className="flex flex-wrap gap-2">
                {state.movieTitles.map((title, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm"
                  >
                    {title}
                  </span>
                ))}
              </div>
            </div>
          )}

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

      {/* 5단계: 영화 포스터 표시 */}
      {state.step === "movies" && state.movieResults.length > 0 && (
        <div className="border rounded-lg p-4 bg-green-50">
          <h3 className="text-lg font-semibold mb-3">🎬 5단계: 영화 포스터</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {state.movieResults.map((movie, index) => (
              <div key={index} className="text-center">
                <div className="bg-white p-2 rounded-lg shadow">
                  {movie.posterUrl ? (
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="w-full h-48 object-cover rounded"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src =
                          "https://via.placeholder.com/200x300?text=No+Image";
                      }}
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded">
                      <span className="text-gray-500 text-sm">포스터 없음</span>
                    </div>
                  )}
                  <p
                    className="text-sm font-medium mt-2 truncate"
                    title={movie.title}
                  >
                    {movie.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {movie.searchStatus === "found"
                      ? "✅ 발견됨"
                      : movie.searchStatus === "not_found"
                      ? "❌ 없음"
                      : movie.searchStatus === "error"
                      ? "⚠️ 오류"
                      : "⏳ 검색중"}
                  </p>
                  {movie.movieInfo && (
                    <p className="text-xs text-gray-600 mt-1">
                      ⭐ {movie.movieInfo.voteAverage}/10
                    </p>
                  )}
                </div>
              </div>
            ))}
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
          <p className="mt-2 text-gray-500">처리 중...</p>
        </div>
      )}
    </div>
  );
};

export default function GeminiTestPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        🎬 AI 영화 추천 시스템 테스트
      </h1>
      <p className="text-gray-600 mb-8 text-center">
        위치 기반 날씨 정보와 사용자 선호도를 바탕으로 Gemini AI가 영화를
        추천해드립니다.
      </p>
      <div className="text-center mb-4">
        <div className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-lg">
          <span className="text-sm">
            🔧 확장 가능한 설계: 현재 {USER_PREFERENCE_CATEGORIES.length}개
            카테고리 지원
          </span>
        </div>
      </div>
      <div className="text-center mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <h4 className="font-medium text-red-700 mb-1">🔴 필수 카테고리</h4>
            <p className="text-sm text-red-600">
              {USER_PREFERENCE_CATEGORIES.filter((cat) => cat.required).length}
              개 - 반드시 선택해야 함
            </p>
            <p className="text-xs text-red-500 mt-1">
              {USER_PREFERENCE_CATEGORIES.filter((cat) => cat.required)
                .map((cat) => cat.name)
                .join(", ")}
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h4 className="font-medium text-blue-700 mb-1">🔵 선택 카테고리</h4>
            <p className="text-sm text-blue-600">
              {USER_PREFERENCE_CATEGORIES.filter((cat) => !cat.required).length}
              개 - 선택적 (더 정확한 추천)
            </p>
            <p className="text-xs text-blue-500 mt-1">
              {USER_PREFERENCE_CATEGORIES.filter((cat) => !cat.required)
                .map((cat) => cat.name)
                .join(", ")}
            </p>
          </div>
        </div>
      </div>
      <GeminiWeatherComponent />
    </div>
  );
}
