"use client";

import { useState, useEffect } from "react";
import PosterCard from "@/app/components/PosterCard";
import { convertToGrid } from "@/utils/supabase/recommenders/coordinate-converter";

// 날씨 정보 타입 정의
interface WeatherInfo {
  temperature: string;
  location: string;
  highTemp: string;
  lowTemp: string;
  feelsLike: string;
  humidity: string;
  precipitation: string;
  fineDust: string;
  weatherIcon: string;
}

const RecommenderPage = () => {
  // 날씨 정보 상태
  const [weatherInfo, setWeatherInfo] = useState<WeatherInfo>({
    temperature: "null",
    location: "null",
    highTemp: "null",
    lowTemp: "null",
    feelsLike: "null",
    humidity: "null",
    precipitation: "null",
    fineDust: "null",
    weatherIcon: "null",
  });

  // 로딩 상태
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);

  // 날씨 태그 상태 관리
  const [selectedWeatherTags, setSelectedWeatherTags] = useState<string[]>([
    "흐려요",
    "비",
  ]);

  // 카테고리별 선택된 태그들
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([
    "맑아요",
  ]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>(["흐려요"]);
  const [selectedTimes, setSelectedTimes] = useState<string[]>(["맑아요"]);

  // 위치 정보 가져오기
  const getUserLocation = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation이 지원되지 않습니다."));
        return;
      }

      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5분 캐시
      });
    });
  };

  // 위치 정보로 주소 가져오기
  const getAddressFromCoordinates = async (
    latitude: number,
    longitude: number
  ) => {
    try {
      const response = await fetch(
        `/api/geocodings?latitude=${latitude}&longitude=${longitude}`
      );
      const data = await response.json();

      console.log("📍 위치 정보 API 응답:", data);

      if (data.success) {
        return data.address;
      } else {
        throw new Error(data.error || "위치 정보를 가져올 수 없습니다.");
      }
    } catch (error) {
      console.error("❌ 위치 정보 가져오기 실패:", error);
      throw error;
    }
  };

  // 날씨 정보 가져오기
  const getWeatherInfo = async (nx: number, ny: number) => {
    try {
      const response = await fetch(`/api/weathers?nx=${nx}&ny=${ny}`);
      const data = await response.json();

      console.log("🌤️ 날씨 정보 API 응답:", data);

      if (data.success && data.weatherInfo) {
        return data.weatherInfo;
      } else {
        throw new Error(data.error || "날씨 정보를 가져올 수 없습니다.");
      }
    } catch (error) {
      console.error("❌ 날씨 정보 가져오기 실패:", error);
      throw error;
    }
  };

  // 페이지 로드 시 위치 정보와 날씨 정보 가져오기
  useEffect(() => {
    const initializeWeatherData = async () => {
      try {
        setIsLoadingWeather(true);
        console.log("🌍 위치 정보 가져오기 시작...");

        // 1. 사용자 위치 정보 가져오기
        const position = await getUserLocation();
        const { latitude, longitude } = position.coords;

        console.log("📍 사용자 위치:", { latitude, longitude });

        // 2. 좌표로 주소 가져오기
        const address = await getAddressFromCoordinates(latitude, longitude);
        console.log("🏠 사용자 주소:", address);

        // 3. 위도/경도를 기상청 격자 좌표로 변환
        const gridCoords = convertToGrid(latitude, longitude);
        const { nx, ny } = gridCoords;

        console.log("🗺️ 기상청 좌표:", { nx, ny });

        // 4. 날씨 정보 가져오기
        const weatherData = await getWeatherInfo(nx, ny);
        console.log("🌤️ 날씨 데이터:", weatherData);

        // 5. 날씨 정보 상태 업데이트
        if (weatherData) {
          setWeatherInfo({
            temperature: weatherData.temperature || "null",
            location: address || "null",
            highTemp: weatherData.highTemp || "null",
            lowTemp: weatherData.lowTemp || "null",
            feelsLike: weatherData.feelsLike || "null",
            humidity: weatherData.humidity || "null",
            precipitation: weatherData.precipitation || "null",
            fineDust: weatherData.fineDust || "null",
            weatherIcon: weatherData.weatherIcon || "null",
          });
        }
      } catch (error) {
        console.error("❌ 날씨 데이터 초기화 실패:", error);
        // 에러 발생 시 기본값 유지
      } finally {
        setIsLoadingWeather(false);
      }
    };

    initializeWeatherData();
  }, []);

  // 날씨 태그 토글 함수
  const toggleWeatherTag = (tag: string) => {
    setSelectedWeatherTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // 카테고리 태그 토글 함수
  const toggleCategoryTag = (tag: string, category: string) => {
    const setterMap = {
      emotion: setSelectedEmotions,
      genre: setSelectedGenres,
      time: setSelectedTimes,
    };

    const setter = setterMap[category as keyof typeof setterMap];
    setter((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="w-full">
      {/* 메인 타이틀 */}
      <div className="text-center mt-10 mb-20">
        <h1 className="text-5xl font-bold text-white">
          취향에 딱 맞춘 영화를 추천해드릴게요
        </h1>
      </div>

      {/* 날씨 섹션 */}
      <div className="w-4/5 mx-auto p-6 mb-8 bg-gray-100 rounded-lg  relative overflow-hidden ">
        {/* 배경 이미지 */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("/assets/images/weather_rain.png")',
          }}
        ></div>

        <div className="flex">
          {/* 왼쪽: 현재 날씨 정보 */}
          <div className="flex-1 mr-10 bg-gray-700/50 rounded-lg p-4 backdrop-blur-sm">
            <h3 className="text-white font-semibold mb-3">현재날씨</h3>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-4xl mb-1 text-blue-300">
                  {isLoadingWeather ? "⏳" : weatherInfo.weatherIcon}
                </div>
                <div className="text-2xl font-bold text-white">
                  {isLoadingWeather ? "로딩중..." : weatherInfo.temperature}
                </div>
                <div className="text-sm text-gray-300">
                  {isLoadingWeather ? "위치 확인 중..." : weatherInfo.location}
                </div>
                <div className="text-sm text-gray-300 mt-1">
                  {isLoadingWeather ? "날씨 확인 중..." : "이부분수정"}
                </div>
              </div>
              <div className="text-sm text-gray-300 space-y-1">
                <div>최고 {weatherInfo.highTemp}</div>
                <div>최저 {weatherInfo.lowTemp}</div>
                <div>체감온도 {weatherInfo.feelsLike}</div>
                <div>습도 {weatherInfo.humidity}</div>
                <div>강수량 {weatherInfo.precipitation}</div>
                <div>미세먼지 {weatherInfo.fineDust} 😊</div>
              </div>
            </div>
          </div>

          {/* 오른쪽: 날씨 질문 */}
          <div className="flex-3 bg-gray-700/50 rounded-lg p-4 backdrop-blur-sm">
            {/* 질문 텍스트 컴포넌트 */}
            <div className="mb-5">
              <p className="text-white text-lg">
                날씨에 따라 기분이....알고 계셨나요?
              </p>
            </div>

            {/* 날씨 태그들 컴포넌트 */}
            <div className="flex flex-wrap gap-2">
              {[
                "맑아요",
                "흐려요",
                "구름 조금",
                "비",
                "안개",
                "눈",
                "바람",
                "더워요",
                "추워요",
                "장마",
                "폭염",
                "한파",
              ].map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleWeatherTag(tag)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border border-blue-300/50 ${
                    selectedWeatherTags.includes(tag)
                      ? "bg-blue-400 text-white"
                      : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 카테고리 섹션 */}
      <div className="w-4/5 mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* 감정 */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">😊</span>
            <h3 className="text-white font-semibold">감정</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              "맑아요",
              "흐려요",
              "신남",
              "우울해요",
              "평온해요",
              "스트레스",
            ].map((tag) => (
              <button
                key={tag}
                onClick={() => toggleCategoryTag(tag, "emotion")}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  selectedEmotions.includes(tag)
                    ? "bg-yellow-500 text-black"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* 장르 */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">🎬</span>
            <h3 className="text-white font-semibold">장르</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {["액션", "로맨스", "코미디", "스릴러", "드라마", "SF"].map(
              (tag) => (
                <button
                  key={tag}
                  onClick={() => toggleCategoryTag(tag, "genre")}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    selectedGenres.includes(tag)
                      ? "bg-yellow-500 text-black"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  {tag}
                </button>
              )
            )}
          </div>
        </div>

        {/* 시간 */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">⏰</span>
            <h3 className="text-white font-semibold">시간</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {["아침", "점심", "저녁", "밤", "새벽"].map((tag) => (
              <button
                key={tag}
                onClick={() => toggleCategoryTag(tag, "time")}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  selectedTimes.includes(tag)
                    ? "bg-yellow-500 text-black"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 추천 시작 버튼 */}
      <div className="text-center mb-12">
        <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-8 rounded-lg flex items-center gap-2 mx-auto transition-colors">
          <span>추천 시작</span>
          <span>→</span>
        </button>
      </div>

      {/* 영화 포스터 섹션 */}
      <div className="mb-8">
        <h2 className="text-white text-xl font-semibold mb-6">추천 영화</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <PosterCard imageUrl="/assets/movies/intern.jpg" name="인턴" />
          <PosterCard
            imageUrl="/assets/movies/interstellar.jpg"
            name="인터스텔라"
          />
          <PosterCard
            imageUrl="/assets/movies/ai.jpg"
            name="A.I. Artificial Intelligence"
          />
          <PosterCard
            imageUrl="/assets/movies/inside-out.jpg"
            name="인사이드 아웃"
          />
        </div>
      </div>
    </div>
  );
};

export default RecommenderPage;
