"use client";

import { TiWeatherDownpour } from "react-icons/ti";
import { WiStars } from "react-icons/wi";
import { SiCoffeescript } from "react-icons/si";
import { MdLocalMovies } from "react-icons/md";
import { CiTimer } from "react-icons/ci";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { WiDaySunny, WiCloudy, WiSnow, WiFog } from "react-icons/wi";

import PosterCard from "@/app/components/PosterCard";
import Button from "./components/Button";
import { useState, useEffect } from "react";
import { getLocationWeatherData } from "../../../utils/supabase/recommenders/weather";
import { ParsedWeatherInfo } from "../../../backend/domain/entities/recommenders/weather";
import { AddressInfo } from "../../../utils/supabase/recommenders/geolocation";
import { TmdbApi } from "../../../utils/tmdb/TmdbApi";
import NoPoster from "./components/NoPoster";

const RecommenderPage = () => {
  const [spin, setSpin] = useState(false);
  const [weatherData, setWeatherData] = useState<ParsedWeatherInfo | null>(
    null
  );
  const [addressInfo, setAddressInfo] = useState<AddressInfo | null>(null);

  // 선택된 버튼들을 관리하는 state
  const [selectedWeather, setSelectedWeather] = useState<string[]>([]);
  const [selectedEmotion, setSelectedEmotion] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string[]>([]);

  // 공통 버튼 선택/해제 함수
  const toggleSelection = (
    category: "weather" | "emotion" | "category" | "time",
    value: string
  ) => {
    switch (category) {
      case "weather":
        setSelectedWeather((prev) =>
          prev.includes(value)
            ? prev.filter((item) => item !== value)
            : [...prev, value]
        );
        break;
      case "emotion":
        setSelectedEmotion((prev) =>
          prev.includes(value)
            ? prev.filter((item) => item !== value)
            : [...prev, value]
        );
        break;
      case "category":
        setSelectedCategory((prev) =>
          prev.includes(value)
            ? prev.filter((item) => item !== value)
            : [...prev, value]
        );
        break;
      case "time":
        setSelectedTime((prev) =>
          prev.includes(value)
            ? prev.filter((item) => item !== value)
            : [...prev, value]
        );
        break;
    }
  };

  // 페이지 렌더링 시 위치 정보와 날씨 정보 자동 가져오기
  useEffect(() => {
    const getLocationAndWeather = async () => {
      try {
        const result = await getLocationWeatherData();
        console.log("위치 정보와 날씨 정보를 성공적으로 가져왔습니다:", result);
        console.log("위치:", result.position);
        console.log("격자 좌표:", result.gridCoordinates);
        console.log("주소:", result.address);
        console.log("날씨 정보:", result.weatherData);
        setWeatherData(result.weatherData);
        setAddressInfo(result.address);
      } catch (error) {
        console.error("위치 정보나 날씨 정보를 가져올 수 없습니다:", error);
      }
    };

    getLocationAndWeather();
  }, []);

  const [movieTitles, setMovieTitles] = useState<string[]>([]);
  const [posterInfos, setPosterInfos] = useState<
    { posterUrl: string | null; title: string }[]
  >([
    { posterUrl: null, title: "" },
    { posterUrl: null, title: "" },
    { posterUrl: null, title: "" },
    { posterUrl: null, title: "" },
  ]);

  // 영화 제목에서 한글/영문 분리
  function parseMovieTitle(title: string): {
    korean: string;
    english: string | null;
  } {
    const match = title.match(/^(.+?)\s*\(([^)]+)\)\s*$/);
    if (match) {
      const korean = match[1].trim();
      const english = match[2].trim();
      if (/^\d{4}$/.test(english)) return { korean, english: null };
      return { korean, english };
    }
    return { korean: title, english: null };
  }

  // TMDB에서 한글→영문 순으로 검색
  async function searchMoviePoster(title: string) {
    const { korean, english } = parseMovieTitle(title);
    // 1. 한글로 검색
    let result: {
      results?: {
        media_type: string;
        poster_path?: string;
        title?: string;
        name?: string;
      }[];
    } = await TmdbApi.searchMulti(korean);
    let movie = result?.results?.find(
      (item) => item.media_type === "movie" && item.poster_path
    );
    // 2. 없으면 영문으로 검색
    if (!movie && english) {
      result = await TmdbApi.searchMulti(english);
      movie = result?.results?.find(
        (item) => item.media_type === "movie" && item.poster_path
      );
    }
    if (movie) {
      return {
        posterUrl: movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : "",
        title: movie.title || movie.name || title,
      };
    }
    return { posterUrl: "", title };
  }

  // AI 추천 결과에서 영화 제목 4개 추출 후 포스터 검색
  useEffect(() => {
    if (!movieTitles || movieTitles.length === 0) return;
    const top4 = movieTitles.slice(0, 4);
    (async () => {
      const posters = await Promise.all(top4.map(searchMoviePoster));
      setPosterInfos(posters);
    })();
  }, [movieTitles]);

  // AI 추천 요청 함수
  const handleRecommendation = async () => {
    try {
      console.log("AI 추천 요청 시작");
      console.log("현재 날씨:", weatherData);
      console.log("선택된 정보:", {
        weather: selectedWeather,
        emotion: selectedEmotion,
        category: selectedCategory,
        time: selectedTime,
      });

      // 로딩 토스트 표시
      const loadingToast = toast.loading("🎬 영화를 추천하고 있습니다...", {
        position: "top-center",
        autoClose: false,
        closeButton: false,
        draggable: false,
      });

      // AI API 호출
      const response = await fetch("/api/geminis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "movie-recommendation",
          weather: weatherData,
          userSelection: {
            weather: selectedWeather,
            emotion: selectedEmotion,
            category: selectedCategory,
            time: selectedTime,
          },
          temperature: 0.7,
          max_tokens: 4096,
        }),
      });

      if (!response.ok) {
        throw new Error(`AI 추천 요청 실패: ${response.status}`);
      }

      const data = await response.json();
      console.log("AI 응답:", data);

      if (!data.success || !data.data) {
        throw new Error(data.error || "AI 추천을 받을 수 없습니다.");
      }

      console.log("AI 추천 성공:", data.data);

      // AI 추천 성공 시 영화 제목 배열 저장
      if (Array.isArray(data.data.movieTitles)) {
        setMovieTitles(data.data.movieTitles);
      }

      // AI 추천 완료 시 spin 상태를 false로 변경
      setSpin(false);

      // 로딩 토스트를 성공 토스트로 업데이트
      toast.update(loadingToast, {
        render: "🎬 영화 추천이 완료되었습니다!",
        type: "success",
        isLoading: false,
        autoClose: 2500,
        closeButton: true,
        draggable: true,
      });
    } catch (error) {
      console.error("AI 추천 요청 중 오류:", error);
      // 에러 발생 시에도 spin 상태를 false로 변경
      setSpin(false);

      // 에러 토스트 표시
      toast.error("❌ 영화 추천에 실패했습니다. 다시 시도해주세요.", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  // 날씨 상태에 따른 아이콘 반환 함수
  const getWeatherIcon = (weatherData: ParsedWeatherInfo | null) => {
    if (!weatherData) return <WiDaySunny size={40} color="#fff" />;

    const description = weatherData.weatherDescription?.toLowerCase() || "";
    const skyCondition = weatherData.skyCondition?.toLowerCase() || "";
    const precipitationType =
      weatherData.precipitationType?.toLowerCase() || "";

    if (precipitationType.includes("눈") || description.includes("눈")) {
      return <WiSnow size={40} color="#fff" />;
    } else if (
      precipitationType.includes("비") ||
      description.includes("비") ||
      description.includes("rain")
    ) {
      return <TiWeatherDownpour size={40} color="#fff" />;
    } else if (
      skyCondition.includes("흐림") ||
      description.includes("흐림") ||
      description.includes("cloudy")
    ) {
      return <WiCloudy size={40} color="#fff" />;
    } else if (description.includes("안개") || description.includes("fog")) {
      return <WiFog size={40} color="#fff" />;
    } else {
      return <WiDaySunny size={40} color="#fff" />;
    }
  };

  // forecastTime을 시간 형식으로 변환하는 함수
  const formatForecastTime = (forecastTime: string | undefined) => {
    if (!forecastTime) return "--";

    // "20250718 1500" 형식에서 시간 부분만 추출
    const timePart = forecastTime.split(" ")[1];
    if (!timePart || timePart.length < 4) return "--";

    // "1500"을 "15:00" 형식으로 변환
    const hour = timePart.substring(0, 2);
    const minute = timePart.substring(2, 4);

    return `${hour}:${minute}`;
  };

  const weatherButtons = ["맑음", "흐림", "비", "눈", "우박", "안개"];
  const emotionButtons = [
    "기쁨",
    "슬픔",
    "화남",
    "행복",
    "우울",
    "신남",
    "짜증",
    "보통",
  ];
  const categoryButtons = [
    "SF",
    "액션",
    "공포",
    "코미디",
    "로맨스",
    "느와르",
    "범죄",
    "스릴러",
  ];
  const timeButtons = ["오전", "오후", "저녁", "새벽"];

  return (
    // 전체 wrap
    <div className="flex flex-col">
      {/* ToastContainer 추가 */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      {/* 취향에 딱 맞춘 영화 */}
      <div className="flex mb-15 justify-center text-white text-5xl">
        취향에 딱 맞춘 영화를 추천해드릴게요
      </div>
      {/* 상단텍스트 + 사용자 정보 카테고리 감싸는 div */}
      <div
        style={{ backgroundColor: "#17181D" }}
        className="flex flex-col w-6/7 h-screen mx-auto pt-15 px-20 rounded-4xl"
      >
        {/* 날씨 + 사용자 정보 감싸는 섹션 */}
        <div className="flex-1 flex-col">
          {/* 날씨 */}
          <div
            style={{
              backgroundImage: "url('/assets/images/weather_rain.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
            className="flex h-1/2 rounded-2xl"
          >
            {/* 날씨 왼쪽 섹션 */}
            {/* 일단 배경색 넣어놓았으나 배경 이미지 달라진다면 JS이용해서 바꿔야하는데.. */}
            <div
              style={{ backgroundColor: "#5A736E77" }}
              className="flex flex-col m-5 p-10 text-white rounded-xl relative"
            >
              <div className="absolute left-50 top-15">
                {getWeatherIcon(weatherData)}
              </div>
              {/* 날씨 기본 정보 섹션 */}
              <div className="flex-1 mb-5 pt-10">
                <span className="flex justify-center text-5xl">
                  {weatherData?.currentTemp
                    ? `${weatherData.currentTemp}°`
                    : "--"}
                </span>
                <span className="flex justify-center text-1xl mt-2">
                  {addressInfo?.city && addressInfo?.district
                    ? `${addressInfo.city} ${addressInfo.district}`
                    : "..."}
                </span>
              </div>
              {/* 날씨 각종 정보 섹션 */}
              <div className="flex ">
                <div className="flex flex-col justify-center pr-5 border-r-2 border-white-100">
                  <span>날ㅤㅤ씨{weatherData?.weatherDescription || "--"}</span>
                  <span>
                    기준시간 {formatForecastTime(weatherData?.forecastTime)}
                  </span>
                  <span>
                    체감온도{" "}
                    {weatherData?.feelsLikeTemp
                      ? `${weatherData.feelsLikeTemp}°`
                      : "--"}
                  </span>
                </div>
                <div className="flex flex-col pl-5">
                  <span>
                    습ㅤㅤ도{" "}
                    {weatherData?.humidity ? `${weatherData.humidity}%` : "--"}
                  </span>
                  <span>
                    강ㅤㅤ수{" "}
                    {weatherData?.precipitation
                      ? `${weatherData.precipitation}mm`
                      : "--"}
                  </span>
                  <span>
                    풍ㅤㅤ속{" "}
                    {weatherData?.windSpeed
                      ? `${weatherData.windSpeed}m/s`
                      : "--"}
                  </span>
                </div>
              </div>
            </div>
            {/* 날씨 오른쪽 섹션*/}
            <div className="flex-1 m-5 text-white">
              <div className="flex h-1/2 items-center px-5 text-2xl leading-loose">
                날씨에 따라 보고싶은 영화가 달라진 경험이 있으신가요?
                <br />
                선택하신 카테고리에 맞는 영화를 추천해드릴게요!
              </div>
              {/* 날씨 버튼 컴포넌트 ex)맑음, 흐림 ...*/}
              <div
                style={{ backgroundColor: "#5A736E77" }}
                className="flex h-1/2 justify-center items-center px-5 gap-2 rounded-xl"
              >
                {weatherButtons.map((item, idx) => {
                  const isSelected = selectedWeather.includes(item);
                  return (
                    <Button
                      key={idx}
                      text={item}
                      onClick={() => toggleSelection("weather", item)}
                      className={`flex justify-center items-center whitespace-nowrap text-lg w-20 h-12 px-5 my-5 ${
                        isSelected ? "bg-blue-500 text-white" : ""
                      }`}
                    ></Button>
                  );
                })}
              </div>
            </div>
          </div>
          {/* 사용자 정보 */}
          <div className="flex pt-5 h-1/2 text-white text-2xl">
            {/* 유저 선택 컴포넌트 */}
            <div
              style={{
                backgroundColor: "#27282D",
                background:
                  "1D1F28 linear-gradient(135deg, #FFFFFF 0%, #092949 100%)",
              }}
              className="flex-1 flex-col my-5 p-5 rounded-xl"
            >
              {/* 아이콘 */}
              <div className="inline-flex justify-center items-center bg-[#DEFFFD] rounded-xl size-12">
                <SiCoffeescript color="4BBEAB" size={28} />
              </div>
              {/* 카테고리 */}
              <div className="mt-5 pl-1 pb-4 border-b-2 border-white">감정</div>

              <div className="inline-flex flex-wrap w-full justify-between">
                {emotionButtons.map((item, idx) => {
                  const isSelected = selectedEmotion.includes(item);
                  return (
                    <Button
                      key={idx}
                      text={item}
                      onClick={() => toggleSelection("emotion", item)}
                      className={`flex justify-center items-center whitespace-nowrap text-lg w-20 h-12 px-5 my-5 ${
                        isSelected ? "bg-blue-500 text-white" : ""
                      }`}
                    ></Button>
                  );
                })}
              </div>
            </div>
            <div
              style={{
                backgroundColor: "#27282D",
                background:
                  "1D1F28 linear-gradient(135deg, #FFFFFF 0%, #092949 100%)",
              }}
              className="flex-1 flex-col my-5 mx-8 p-5 rounded-xl"
            >
              <div className="inline-flex justify-center items-center bg-[#DEFFFD] rounded-xl size-12">
                <MdLocalMovies color="4BBEAB" size={28} />
              </div>
              <div className="mt-5 pl-1 pb-4 border-b-2 border-white">장르</div>

              <div className="inline-flex flex-wrap w-full justify-between">
                {categoryButtons.map((item, idx) => {
                  const isSelected = selectedCategory.includes(item);
                  return (
                    <Button
                      key={idx}
                      text={item}
                      onClick={() => toggleSelection("category", item)}
                      className={`flex justify-center items-center whitespace-nowrap text-lg w-20 h-12 px-5 my-5 ${
                        isSelected ? "bg-blue-500 text-white" : ""
                      }`}
                    ></Button>
                  );
                })}
              </div>
            </div>

            <div
              style={{
                backgroundColor: "#27282D",
                background:
                  "1D1F28 linear-gradient(135deg, #FFFFFF 0%, #092949 100%)",
              }}
              className="flex-1 flex-col my-5 p-5 rounded-xl"
            >
              <div className="inline-flex justify-center items-center bg-[#DEFFFD] rounded-xl size-12">
                <CiTimer color="4BBEAB" size={28} />
              </div>
              <div className="mt-5 pl-1 pb-4 border-b-2 border-white">시간</div>

              <div className="inline-flex flex-wrap w-full justify-between">
                {timeButtons.map((item, idx) => {
                  const isSelected = selectedTime.includes(item);
                  return (
                    <Button
                      key={idx}
                      text={item}
                      onClick={() => toggleSelection("time", item)}
                      className={`flex justify-center items-center whitespace-nowrap text-lg w-20 h-12 px-5 my-5 ${
                        isSelected ? "bg-blue-500 text-white" : ""
                      }`}
                    ></Button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        {/* 추천 시작 버튼 */}
        {/* 뒤에 이미지를 추가해야돼서 버튼 컴포넌트 사용 못해서 직접 작성함*/}

        <div className="flex my-10 justify-center items-center">
          <button
            className={`text-2xl hover:cursor-pointer half-border-spin ${
              spin ? " spin-active" : ""
            }`}
            onClick={() => {
              setSpin(!spin);
              handleRecommendation();
            }}
            style={{
              borderColor: "#56EBE1",
              color: "#56EBE1",
              background: "none",
              border: "none",
              padding: 0,
            }}
          >
            <span
              style={{
                position: "relative",
                zIndex: 3,
                display: "flex",
                alignItems: "center",
              }}
            >
              {spin ? "ㅤ추천 중 .." : "ㅤ추천 시작"}
              <WiStars
                style={{ color: "#56EBE1" }}
                size={32}
                className="ml-2 justify-center items-center"
              />
            </span>
          </button>
        </div>
      </div>
      {/* 영화 정보 나타내는 */}
      <div className="flex justify-between items-center h-180 mt-30">
        {/* 왼쪽 포스터 카드 */}
        <div className="flex w-1/6 h-3/4 justify-center relative group">
          {posterInfos[0]?.posterUrl ? (
            <PosterCard
              imageUrl={posterInfos[0].posterUrl}
              name={posterInfos[0].title || "1"}
              className="w-full h-full group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <NoPoster className="w-full h-full" />
          )}
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-black/100 pointer-events-none transition-transform duration-300 group-hover:scale-110"></div>
        </div>
        {/* 가운데 포스터 카드 */}
        <div className="flex w-3/5 h-1/1 mx-20">
          {/* 가운데 왼쪽 */}
          {posterInfos[1]?.posterUrl ? (
            <PosterCard
              imageUrl={posterInfos[1].posterUrl}
              name={posterInfos[1].title || "2"}
              className="mr-2.5 max-w-full max-h-full object-contain"
            />
          ) : (
            <NoPoster className="mr-2.5 max-w-full max-h-full object-contain w-full h-full" />
          )}
          {/* 가운데 오른쪽 */}
          {posterInfos[2]?.posterUrl ? (
            <PosterCard
              imageUrl={posterInfos[2].posterUrl}
              name={posterInfos[2].title || "3"}
              className="ml-2.5 max-w-full max-h-full object-contain"
            />
          ) : (
            <NoPoster className="ml-2.5 max-w-full max-h-full object-contain w-full h-full" />
          )}
        </div>
        {/* 오른쪽 포스터 카드 */}
        <div className="flex w-1/5 h-3/4 relative group">
          {posterInfos[3]?.posterUrl ? (
            <PosterCard
              imageUrl={posterInfos[3].posterUrl}
              name={posterInfos[3].title || "4"}
              className="ml-10 max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <NoPoster className="ml-10 max-w-full max-h-full object-contain w-full h-full" />
          )}
          <div className="absolute inset-0 bg-gradient-to-l from-black/100 via-transparent to-transparent pointer-events-none transition-transform duration-300 group-hover:scale-110"></div>
        </div>
      </div>
    </div>
  );
};

export default RecommenderPage;
