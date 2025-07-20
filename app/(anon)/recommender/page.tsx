"use client";

import { TiWeatherDownpour } from "react-icons/ti";
import { WiStars } from "react-icons/wi";
import { SiCoffeescript } from "react-icons/si";
import { MdLocalMovies } from "react-icons/md";
import { CiTimer } from "react-icons/ci";
import { IoMdCloseCircle } from "react-icons/io";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { WiDaySunny, WiCloudy } from "react-icons/wi";

import ClickablePosterCard from "./components/ClickablePosterCard";
import LoadingPoster from "./components/LoadingPoster";
import Button from "./components/Button";
import TrendMovies from "./components/TrendMovies";
import MovieDetailModal from "../movie-detail/components/MovieDetailModal";
import { useState, useEffect } from "react";
import Image from "next/image"; // next/image 추가
import { getLocationWeatherData } from "../../../utils/supabase/recommenders/weather";
import { ParsedWeatherInfo } from "../../../backend/domain/entities/recommenders/weather";
import { AddressInfo } from "../../../utils/supabase/recommenders/geolocation";

const RecommenderPage = () => {
  const [spin, setSpin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showMovieDetailModal, setShowMovieDetailModal] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const [weatherData, setWeatherData] = useState<ParsedWeatherInfo | null>(
    null
  );
  const [addressInfo, setAddressInfo] = useState<AddressInfo | null>(null);

  // 선택된 버튼들을 관리하는 state
  const [selectedWeather, setSelectedWeather] = useState<string>(""); // 날씨는 단일 선택
  const [selectedEmotion, setSelectedEmotion] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string[]>([]);

  // 포스터 클릭 핸들러
  const handlePosterClick = (movieTitle: string) => {
    // Backend 검색 API를 사용하여 영화 ID 찾기
    fetch(`/api/movies/search?query=${encodeURIComponent(movieTitle)}&page=1`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`검색 요청 실패: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // 검색 결과에서 영화만 필터링
        const movie = data.results?.find(
          (item: { media_type: string; id: number }) =>
            item.media_type === "movie"
        );

        if (movie && movie.id) {
          console.log(`영화 "${movieTitle}" ID 찾음:`, movie.id);
          setSelectedMovieId(movie.id);
          setShowMovieDetailModal(true);
        } else {
          console.warn(`영화 "${movieTitle}" 검색 결과 없음`);
          toast.error(`"${movieTitle}" 영화 정보를 찾을 수 없습니다.`);
        }
      })
      .catch((error) => {
        console.error("영화 검색 중 오류:", error);
        toast.error(
          "영화 정보를 불러올 수 없습니다. 잠시 후 다시 시도해주세요."
        );
      });
  };

  // 공통 버튼 선택/해제 함수
  const toggleSelection = (
    category: "weather" | "emotion" | "category" | "time",
    value: string
  ) => {
    // 버튼 클릭 시 해당 카테고리의 에러 상태 초기화
    setValidationErrors((prev) => ({
      ...prev,
      [category]: false,
    }));

    switch (category) {
      case "weather":
        // 날씨는 하나만 선택 가능 (라디오 버튼 방식)
        setSelectedWeather((prev) => (prev === value ? "" : value));
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

  // 페이지 렌더링 시 위치 정보와 날씨 정보 자동 가져오기 (재시도 로직 포함)
  useEffect(() => {
    const getLocationAndWeather = async (retryCount = 0) => {
      const maxRetries = 3; // 최대 3번 재시도
      const retryDelay = 2000; // 2초 후 재시도

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
        console.error(
          `위치 정보나 날씨 정보를 가져올 수 없습니다 (시도 ${retryCount + 1}/${
            maxRetries + 1
          }):`,
          error
        );

        // 재시도 횟수가 남아있으면 재시도
        if (retryCount < maxRetries) {
          console.log(`${retryDelay / 1000}초 후 재시도합니다...`);
          setTimeout(() => {
            getLocationAndWeather(retryCount + 1);
          }, retryDelay);
        } else {
          console.error(
            "최대 재시도 횟수를 초과했습니다. 기상청 API를 확인해주세요."
          );
        }
      }
    };

    getLocationAndWeather();
  }, []);

  const [movieTitles, setMovieTitles] = useState<string[]>([]);
  const [posterInfos, setPosterInfos] = useState<
    { posterUrl: string; title: string }[]
  >([
    { posterUrl: "", title: "" },
    { posterUrl: "", title: "" },
    { posterUrl: "", title: "" },
    { posterUrl: "", title: "" },
  ]);
  const [showPosters, setShowPosters] = useState(false); // 포스터 영역 표시 여부
  const [previousMovieTitles, setPreviousMovieTitles] = useState<string[]>([]); // 이전 추천 영화 목록
  const [currentLoadingToast, setCurrentLoadingToast] = useState<
    string | number | null
  >(null); // 현재 로딩 토스트 ID
  const [currentStartIndex, setCurrentStartIndex] = useState(0); // 현재 포스터 시작 인덱스
  const [hasScrolled, setHasScrolled] = useState(false); // 스크롤 실행 여부 플래그
  const [validationErrors, setValidationErrors] = useState<{
    weather: boolean;
    emotion: boolean;
    category: boolean;
    time: boolean;
  }>({
    weather: false,
    emotion: false,
    category: false,
    time: false,
  });

  // 포스터 로딩 상태 관리 함수들
  const setPosterLoading = (index: number, isLoading: boolean) => {
    setLoadingPosters((prev) => {
      const newSet = new Set(prev);
      if (isLoading) {
        newSet.add(index);
      } else {
        newSet.delete(index);
      }
      return newSet;
    });
  };

  const setPosterLoaded = (posterUrl: string) => {
    setLoadedPosters((prev) => new Set(prev).add(posterUrl));
  };

  const isPosterLoaded = (posterUrl: string) => {
    return loadedPosters.has(posterUrl);
  };

  // 무한 루프 슬라이더 핸들러
  const handlePrev = () => {
    const newStartIndex =
      currentStartIndex === 0 ? posterInfos.length - 1 : currentStartIndex - 1;

    // 새로 표시될 포스터들의 인덱스 계산
    const newVisibleIndices = [];
    for (let i = 0; i < 4; i++) {
      const index = (newStartIndex + i) % posterInfos.length;
      newVisibleIndices.push(index);
    }

    // 새로 표시되는 포스터만 로딩 상태로 설정
    newVisibleIndices.forEach((posterIndex, displayIndex) => {
      const poster = posterInfos[posterIndex];
      if (poster && poster.posterUrl && !isPosterLoaded(poster.posterUrl)) {
        setPosterLoading(displayIndex, true);

        // 백업: 2.5초 후 자동으로 로딩 상태 해제
        setTimeout(() => {
          setPosterLoading(displayIndex, false);
        }, 2500);
      }
    });

    setCurrentStartIndex(newStartIndex);
  };

  const handleNext = () => {
    const newStartIndex =
      currentStartIndex >= posterInfos.length - 1 ? 0 : currentStartIndex + 1;

    // 새로 표시될 포스터들의 인덱스 계산
    const newVisibleIndices = [];
    for (let i = 0; i < 4; i++) {
      const index = (newStartIndex + i) % posterInfos.length;
      newVisibleIndices.push(index);
    }

    // 새로 표시되는 포스터만 로딩 상태로 설정
    newVisibleIndices.forEach((posterIndex, displayIndex) => {
      const poster = posterInfos[posterIndex];
      if (poster && poster.posterUrl && !isPosterLoaded(poster.posterUrl)) {
        setPosterLoading(displayIndex, true);

        // 백업: 2.5초 후 자동으로 로딩 상태 해제
        setTimeout(() => {
          setPosterLoading(displayIndex, false);
        }, 2500);
      }
    });

    setCurrentStartIndex(newStartIndex);
  };

  // 현재 화면에 보이는 포스터 4개 (순환 로직 포함)
  const getVisiblePosters = () => {
    const posters = [];
    for (let i = 0; i < 4; i++) {
      const index = (currentStartIndex + i) % posterInfos.length;
      posters.push(posterInfos[index]);
    }
    return posters;
  };

  const visiblePosters = getVisiblePosters();

  // AI 추천 결과에서 영화 제목 4개 추출 후 포스터 검색
  useEffect(() => {
    if (!movieTitles || movieTitles.length === 0) return;

    // TMDB API 호출 시작 시 토스트 메시지 업데이트 (지연)
    if (currentLoadingToast) {
      setTimeout(() => {
        toast.update(currentLoadingToast, {
          render: "화면에 이미지를 표시중이에요!",
          isLoading: true,
        });
      }, 300);
    }

    const top10 = movieTitles.slice(0, 10); // 최대 10개만 시도
    (async () => {
      // 포스터가 있는 영화만 배열에 담기 위한 임시 배열
      const posters: { posterUrl: string; title: string }[] = [];
      for (const title of top10) {
        const response = await fetch(
          `/api/movies/search?query=${encodeURIComponent(title)}&page=1`
        );
        const data = await response.json();
        // poster_path가 있는 영화만 추출
        const movie = data.results?.find(
          (item: {
            media_type: string;
            poster_path?: string;
            title?: string;
            name?: string;
          }) => item.media_type === "movie" && item.poster_path
        );
        if (movie && movie.poster_path) {
          posters.push({
            posterUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            title: movie.title || movie.name || title,
          });
        }
        // 10개까지 모두 수집 (4개 제한 제거)
      }
      setPosterInfos(posters);
    })();
  }, [movieTitles, currentLoadingToast]);

  // AI 추천 요청 함수
  const handleRecommendation = async () => {
    try {
      // 유효성 검사
      const errors = {
        weather: !selectedWeather,
        emotion: selectedEmotion.length === 0,
        category: selectedCategory.length === 0,
        time: selectedTime.length === 0,
      };

      setValidationErrors(errors);

      // 하나라도 선택되지 않았으면 추천 중단
      if (Object.values(errors).some((error) => error)) {
        toast.error("❌ 모든 카테고리를 선택해주세요.", {
          position: "top-center",
          autoClose: 3000,
        });
        return;
      }

      // 유효성 검사 통과 시 모달 열기 및 spin 상태 변경
      setShowModal(true);
      setSpin(true);

      console.log("AI 추천 요청 시작");
      console.log("현재 날씨:", weatherData);
      console.log("선택된 정보:", {
        weather: selectedWeather,
        emotion: selectedEmotion,
        category: selectedCategory,
        time: selectedTime,
      });

      // 재추천 시 기존 데이터 초기화
      setPosterInfos([
        { posterUrl: "", title: "" },
        { posterUrl: "", title: "" },
        { posterUrl: "", title: "" },
        { posterUrl: "", title: "" },
        { posterUrl: "", title: "" },
        { posterUrl: "", title: "" },
        { posterUrl: "", title: "" },
        { posterUrl: "", title: "" },
        { posterUrl: "", title: "" },
        { posterUrl: "", title: "" },
      ]);
      setMovieTitles([]);
      setLoadedCount(0);
      setShowPosters(false); // 포스터 영역 숨기기
      setCurrentStartIndex(0); // 포스터 인덱스 초기화
      setHasScrolled(false); // 스크롤 플래그 초기화

      // 로딩 토스트 표시
      const loadingToast = toast.loading("요청하신 정보를 종합하고 있어요!", {
        position: "top-center",
        autoClose: false,
        closeButton: false,
        draggable: false,
      });
      setCurrentLoadingToast(loadingToast); // 로딩 토스트 ID 저장

      // 토스트 표시 직후 1초 뒤에 메시지 변경
      setTimeout(() => {
        toast.update(loadingToast, {
          render: "영화 추천 리스트를 뽑고 있어요!",
          isLoading: true,
        });
      }, 2700);

      // AI API 호출 전 요청 데이터 로깅
      const requestData = {
        type: "movie-recommendation",
        weather: weatherData,
        userSelection: {
          weather: selectedWeather,
          emotion: selectedEmotion,
          category: selectedCategory,
          time: selectedTime,
        },
        previousMovieTitles: previousMovieTitles, // 이전 추천 영화 목록 전달
        temperature: 0.7,
        max_tokens: 4096,
      };

      console.log("=== AI API 요청 시작 ===");
      console.log("요청 URL:", "/api/geminis");
      console.log("요청 메서드:", "POST");
      console.log("요청 데이터:", JSON.stringify(requestData, null, 2));
      console.log("날씨 데이터:", weatherData);
      console.log("사용자 선택:", {
        weather: selectedWeather,
        emotion: selectedEmotion,
        category: selectedCategory,
        time: selectedTime,
      });
      console.log("이전 영화 목록:", previousMovieTitles);

      // AI API 호출
      const response = await fetch("/api/geminis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      console.log("=== AI API 응답 처리 시작 ===");
      console.log("응답 상태:", response.status);
      console.log("응답 상태 텍스트:", response.statusText);
      console.log("응답 헤더:", Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        console.error("=== AI API 응답 오류 ===");
        console.error("HTTP 상태 코드:", response.status);
        console.error("HTTP 상태 텍스트:", response.statusText);
        throw new Error(`AI 추천 요청 실패: ${response.status}`);
      }

      const data = await response.json();
      console.log("=== AI API 응답 데이터 ===");
      console.log("전체 응답:", JSON.stringify(data, null, 2));
      console.log("응답 success 필드:", data.success);
      console.log("응답 data 필드:", data.data);
      console.log("응답 error 필드:", data.error);

      if (!data.success || !data.data) {
        console.error("=== AI API 응답 검증 실패 ===");
        console.error("success 필드:", data.success);
        console.error("data 필드:", data.data);
        console.error("error 필드:", data.error);
        throw new Error(data.error || "AI 추천을 받을 수 없습니다.");
      }

      console.log("=== AI 추천 성공 ===");
      console.log("추천 데이터:", data.data);
      console.log("영화 제목 배열:", data.data.movieTitles);
      console.log("영화 제목 개수:", data.data.movieTitles?.length || 0);

      // AI 추천 성공 시 영화 제목 배열 저장
      if (Array.isArray(data.data.movieTitles)) {
        setMovieTitles(data.data.movieTitles);
        setPreviousMovieTitles(data.data.movieTitles); // 현재 영화 목록을 이전 목록으로 저장
        setShowPosters(true); // 포스터 영역 표시
      }
    } catch (error) {
      console.error("=== AI 추천 요청 중 오류 발생 ===");
      console.error(
        "에러 타입:",
        error instanceof Error ? error.constructor.name : typeof error
      );
      console.error(
        "에러 메시지:",
        error instanceof Error ? error.message : String(error)
      );
      console.error(
        "에러 스택:",
        error instanceof Error ? error.stack : "스택 정보 없음"
      );
      console.error("전체 에러 객체:", error);

      // 네트워크 에러인지 확인
      if (
        error instanceof Error &&
        error.name === "TypeError" &&
        error.message.includes("fetch")
      ) {
        console.error("네트워크 연결 오류로 판단됨");
      }

      // JSON 파싱 에러인지 확인
      if (
        error instanceof Error &&
        error.name === "SyntaxError" &&
        error.message.includes("JSON")
      ) {
        console.error("JSON 파싱 오류로 판단됨");
      }

      setSpin(false); // 에러 시에는 즉시 spin false

      // 에러 시 기존 로딩 토스트 종료
      if (currentLoadingToast) {
        toast.dismiss(currentLoadingToast);
        setCurrentLoadingToast(null);
      }

      toast.error("❌ 추천 중 문제가 생겼습니다. 다시 눌러주세요!", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  // 포스터 이미지 로딩 완료 개수 상태
  const [loadedCount, setLoadedCount] = useState(0);
  const [loadingPosters, setLoadingPosters] = useState<Set<number>>(new Set());
  const [loadedPosters, setLoadedPosters] = useState<Set<string>>(new Set());

  // posterInfos가 바뀔 때마다 loadedCount 초기화 + 추천 결과가 0개면 spin false
  useEffect(() => {
    setLoadedCount(0);
    if (posterInfos.length === 0) {
      setSpin(false); // 추천 결과가 없을 때도 spin을 false로
    }
  }, [posterInfos]);

  // 모든 포스터 이미지가 렌더링(onLoad)된 경우에만 spin을 false로 변경
  useEffect(() => {
    // 현재 화면에 보이는 포스터 4개가 모두 로드되면 spin false
    const visiblePostersCount = Math.min(4, posterInfos.length);
    if (
      posterInfos.length > 0 &&
      loadedCount >= visiblePostersCount &&
      !hasScrolled
    ) {
      setSpin(false);
      setHasScrolled(true); // 스크롤 실행 플래그 설정

      // 포스터 렌더링 완료 시 스크롤 실행 (한 번만)
      setTimeout(() => {
        const posterSection = document.getElementById("poster-section");
        if (posterSection) {
          const rect = posterSection.getBoundingClientRect();
          const scrollTop =
            window.pageYOffset || document.documentElement.scrollTop;
          const headerHeight = 64; // 헤더 높이
          const targetPosition = scrollTop + rect.top - headerHeight - 100;

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        }
      }, 500); // 포스터 렌더링 완료 후 0.5초 뒤 스크롤

      // 포스터 렌더링 완료 시 기존 토스트를 완료 메시지로 업데이트 (지연)
      if (currentLoadingToast) {
        setTimeout(() => {
          toast.update(currentLoadingToast, {
            render: "완료되었어요!",
            type: "success",
            isLoading: false,
            autoClose: 2500,
            closeButton: true,
            draggable: true,
          });
          setCurrentLoadingToast(null); // 토스트 ID 초기화
        }, 500);
      }
    }
  }, [loadedCount, posterInfos, currentLoadingToast, hasScrolled]);

  // 강수량과 습도를 기반으로 날씨 상태를 계산하는 함수
  const getWeatherStatus = (weatherData: ParsedWeatherInfo | null) => {
    if (!weatherData) return "--";

    // 강수량 파싱 (예: "5mm" -> 5)
    const precipitationStr = weatherData.precipitation;
    const precipitationValue =
      precipitationStr &&
      precipitationStr !== "0mm" &&
      precipitationStr !== "--"
        ? parseFloat(precipitationStr.replace("mm", ""))
        : 0;

    // 습도 (이미 숫자로 파싱되어 있음)
    const humidity = weatherData.humidity || 0;

    // 강수량이 0초과면 "비옴"
    if (precipitationValue > 0) {
      return "비";
    }

    // 습도가 80% 이상이면 "흐림"
    if (humidity >= 80) {
      return "흐림";
    }

    // 그 외의 경우 "맑음"
    return "맑음";
  };

  // 날씨 상태에 따른 비디오 파일명 반환 함수
  const getWeatherVideo = (weatherData: ParsedWeatherInfo | null) => {
    if (!weatherData) return "/assets/videos/weather_rain.mp4"; // 기본값: 비

    const weatherStatus = getWeatherStatus(weatherData);

    switch (weatherStatus) {
      case "맑음":
        return "/assets/videos/weather_sun.mp4";
      case "흐림":
        return "/assets/videos/weather_cloud.mp4";
      case "비":
        return "/assets/videos/weather_rain.mp4";
      default:
        return "/assets/videos/weather_rain.mp4"; // 기본값
    }
  };

  // 선택된 날씨 버튼에 따른 비디오 파일명 반환 함수
  const getSelectedWeatherVideo = () => {
    if (!selectedWeather) {
      // 선택된 날씨가 없으면 기상청 데이터 기반
      return getWeatherVideo(weatherData);
    }

    // 선택된 날씨 버튼에 따른 비디오
    switch (selectedWeather) {
      case "맑음":
        return "/assets/videos/weather_sun.mp4";
      case "흐림":
        return "/assets/videos/weather_cloud.mp4";
      case "비":
        return "/assets/videos/weather_rain.mp4";
      case "눈":
        return "/assets/videos/weather_snow.mp4";
      case "천둥":
        return "/assets/videos/weather_thunder.mp4";
      default:
        return "/assets/videos/weather_rain.mp4";
    }
  };

  // 날씨 상태에 따른 아이콘 반환 함수
  const getWeatherIcon = (weatherData: ParsedWeatherInfo | null) => {
    if (!weatherData) return <WiDaySunny size={60} color="#fff" />;

    const weatherStatus = getWeatherStatus(weatherData);

    if (weatherStatus === "비") {
      return <TiWeatherDownpour size={60} color="#fff" />;
    } else if (weatherStatus === "흐림") {
      return <WiCloudy size={60} color="#fff" />;
    } else {
      return <WiDaySunny size={60} color="#fff" />;
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

  const weatherButtons = ["맑음", "흐림", "비", "눈", "천둥"];
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
        toastStyle={{
          backgroundColor: "#5A736E77",
          color: "#ffffff",
        }}
      />

      {/* 취향에 딱 맞춘 영화 */}
      <div className="flex mb-15 justify-center text-white text-5xl">
        취향에 딱 맞춘 영화를 추천해드릴게요
      </div>
      {/* 상단텍스트 + 사용자 정보 카테고리 감싸는 div */}
      <div
        style={{ backgroundColor: "#17181D" }}
        className="flex flex-col w-6/7 mx-auto pt-15 px-20 rounded-4xl"
      >
        {/* 날씨 + 사용자 정보 감싸는 섹션 */}
        <div className="flex flex-col">
          {/* 날씨 */}
          <div className="flex min-h-80 rounded-2xl relative overflow-hidden">
            {/* 비디오 배경 */}
            <video
              key={getSelectedWeatherVideo()} // 비디오 변경 시 재렌더링
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
              style={{ zIndex: 0 }}
            >
              <source src={getSelectedWeatherVideo()} type="video/mp4" />
            </video>
            {/* 날씨 왼쪽 섹션 */}
            <div
              style={{ backgroundColor: "#5A736E77", zIndex: 1 }}
              className="flex flex-col m-5 p-10 text-white rounded-xl relative"
            >
              <div className="absolute left-60 top-15">
                {weatherData && getWeatherIcon(weatherData)}
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
                  <span>
                    날ㅤㅤ씨 {weatherData?.weatherDescription || "--"}
                  </span>
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
                      ? `${weatherData.precipitation}`
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
            <div className="flex-1 m-5 text-white" style={{ zIndex: 1 }}>
              <div className="flex min-h-40 items-center px-5 text-2xl leading-loose">
                날씨에 따라 보고싶은 영화가 달라진 경험이 있으신가요?
                <br />
                선택하신 카테고리에 맞는 영화를 추천해드릴게요!
              </div>
              {/* 날씨 버튼 컴포넌트 ex)맑음, 흐림 ...*/}
              <div
                style={{
                  backgroundColor: "#5A736E77",
                  border: validationErrors.weather
                    ? "2px solid #ff4444"
                    : "none",
                }}
                className="flex min-h-40 justify-center items-center px-5 gap-2 rounded-xl flex-wrap overflow-hidden"
              >
                {weatherButtons.map((item, idx) => {
                  const isSelected = selectedWeather === item;
                  return (
                    <div key={idx}>
                      <button
                        onClick={() => toggleSelection("weather", item)}
                        style={{
                          backgroundColor: isSelected ? "#56EBE155" : "",
                        }}
                        className={`flex justify-center items-center whitespace-nowrap text-lg w-20 h-12 px-5 my-5 border-2 rounded-lg hover:cursor-pointer transition-transform duration-200 hover:-translate-y-1.5`}
                      >
                        {item}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          {/* 사용자 정보 */}
          <div className="flex pt-5 text-white text-2xl overflow-hidden">
            {/* 유저 선택 컴포넌트 */}
            <div
              style={{
                backgroundColor: "#27282D",
                background:
                  "1D1F28 linear-gradient(135deg, #FFFFFF 0%, #092949 100%)",
                border: validationErrors.emotion ? "2px solid #ff4444" : "none",
              }}
              className="flex-1 flex-col my-5 p-5 rounded-xl overflow-hidden"
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
                border: validationErrors.emotion ? "2px solid #ff4444" : "none",
              }}
              className="flex-1 flex-col my-5 mx-8 p-5 rounded-xl overflow-hidden"
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
                border: validationErrors.time ? "2px solid #ff4444" : "none",
              }}
              className="flex-1 flex-col my-5 p-5 rounded-xl overflow-hidden"
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

        <div className="flex my-10 justify-center items-center overflow-hidden">
          <button
            className={`text-2xl half-border-spin ${
              spin ? " spin-active" : "hover:cursor-pointer"
            } ${spin ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => {
              handleRecommendation();
            }}
            style={{
              borderColor: "#56EBE1",
              color: "#56EBE1",
              background: "none",
              border: "none",
              padding: 0,
            }}
            disabled={spin}
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
      {/* 추천 영화 섹션 */}
      {showPosters && (
        <div className="mt-10">
          <div className="flex p-4 mb-8">
            <div className="flex-start text-4xl font-bold text-white">
              추천 영화
            </div>
          </div>

          <div
            id="poster-section"
            className="flex justify-between items-center h-180 overflow-hidden relative"
          >
            {/* 왼쪽 화살표 - 항상 표시 */}
            <button
              onClick={handlePrev}
              className="absolute left-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-all duration-300"
              aria-label="이전 포스터"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {/* 오른쪽 화살표 - 항상 표시 */}
            <button
              onClick={handleNext}
              className="absolute right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-all duration-300"
              aria-label="다음 포스터"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            {/* 왼쪽 포스터 카드 */}
            <div className="flex w-1/6 h-3/4 justify-center relative group">
              {/* 로딩 중이거나 포스터가 없는 경우 로딩 컴포넌트 표시 */}
              {loadingPosters.has(0) ||
              !visiblePosters[0] ||
              !visiblePosters[0].posterUrl ? (
                <LoadingPoster className="w-full h-full" />
              ) : (
                <>
                  <ClickablePosterCard
                    imageUrl={visiblePosters[0].posterUrl}
                    name={visiblePosters[0].title || "1"}
                    className="w-full h-full group-hover:scale-110 transition-transform duration-300"
                    onClick={() => handlePosterClick(visiblePosters[0].title)}
                  />
                  {/* invisible next/image로 onLoad 감지 */}
                  <div style={{ position: "relative", width: 0, height: 0 }}>
                    <Image
                      src={visiblePosters[0].posterUrl}
                      alt=""
                      fill
                      style={{ display: "none" }}
                      onLoad={() => {
                        setLoadedCount((count) => count + 1);
                        setPosterLoading(0, false);
                        setPosterLoaded(visiblePosters[0].posterUrl);
                      }}
                      onError={() => {
                        console.error(
                          "왼쪽 포스터 이미지 로드 실패:",
                          visiblePosters[0].posterUrl
                        );
                        setPosterLoading(0, false);
                      }}
                      sizes="(max-width: 768px) 100vw, 308px"
                      priority
                    />
                  </div>
                </>
              )}
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-black/100 pointer-events-none transition-transform duration-300 group-hover:scale-110"></div>
            </div>
            {/* 가운데 포스터 카드 */}
            <div className="flex w-3/5 h-full justify-center items-center">
              {/* 가운데 왼쪽 */}
              {loadingPosters.has(1) ||
              !visiblePosters[1] ||
              !visiblePosters[1].posterUrl ? (
                <LoadingPoster className="mr-1 max-w-full max-h-full object-contain" />
              ) : (
                <>
                  <ClickablePosterCard
                    imageUrl={visiblePosters[1].posterUrl}
                    name={visiblePosters[1].title || "2"}
                    className="mr-1 max-w-full max-h-full object-contain"
                    onClick={() => handlePosterClick(visiblePosters[1].title)}
                  />
                  <div style={{ position: "relative", width: 0, height: 0 }}>
                    <Image
                      src={visiblePosters[1].posterUrl}
                      alt=""
                      fill
                      style={{ display: "none" }}
                      onLoad={() => {
                        setLoadedCount((count) => count + 1);
                        setPosterLoading(1, false);
                        setPosterLoaded(visiblePosters[1].posterUrl);
                      }}
                      onError={() => {
                        console.error(
                          "가운데 왼쪽 포스터 이미지 로드 실패:",
                          visiblePosters[1].posterUrl
                        );
                        setPosterLoading(1, false);
                      }}
                      sizes="(max-width: 768px) 100vw, 308px"
                      priority
                    />
                  </div>
                </>
              )}
              {/* 가운데 오른쪽 */}
              {loadingPosters.has(2) ||
              !visiblePosters[2] ||
              !visiblePosters[2].posterUrl ? (
                <LoadingPoster className="ml-1 max-w-full max-h-full object-contain" />
              ) : (
                <>
                  <ClickablePosterCard
                    imageUrl={visiblePosters[2].posterUrl}
                    name={visiblePosters[2].title || "3"}
                    className="ml-1 max-w-full max-h-full object-contain"
                    onClick={() => handlePosterClick(visiblePosters[2].title)}
                  />
                  <div style={{ position: "relative", width: 0, height: 0 }}>
                    <Image
                      src={visiblePosters[2].posterUrl}
                      alt=""
                      fill
                      style={{ display: "none" }}
                      onLoad={() => {
                        setLoadedCount((count) => count + 1);
                        setPosterLoading(2, false);
                        setPosterLoaded(visiblePosters[2].posterUrl);
                      }}
                      onError={() => {
                        console.error(
                          "가운데 오른쪽 포스터 이미지 로드 실패:",
                          visiblePosters[2].posterUrl
                        );
                        setPosterLoading(2, false);
                      }}
                      sizes="(max-width: 768px) 100vw, 308px"
                      priority
                    />
                  </div>
                </>
              )}
            </div>
            {/* 오른쪽 포스터 카드 */}
            <div className="flex w-1/6 h-3/4 relative group">
              {loadingPosters.has(3) ||
              !visiblePosters[3] ||
              !visiblePosters[3].posterUrl ? (
                <LoadingPoster className="w-full h-full transition-transform duration-300 group-hover:scale-110" />
              ) : (
                <>
                  <ClickablePosterCard
                    imageUrl={visiblePosters[3].posterUrl}
                    name={visiblePosters[3].title || "4"}
                    className="w-full h-full transition-transform duration-300 group-hover:scale-110"
                    onClick={() => handlePosterClick(visiblePosters[3].title)}
                  />
                  <div style={{ position: "relative", width: 0, height: 0 }}>
                    <Image
                      src={visiblePosters[3].posterUrl}
                      alt=""
                      fill
                      style={{ display: "none" }}
                      onLoad={() => {
                        setLoadedCount((count) => count + 1);
                        setPosterLoading(3, false);
                        setPosterLoaded(visiblePosters[3].posterUrl);
                      }}
                      onError={() => {
                        console.error(
                          "오른쪽 포스터 이미지 로드 실패:",
                          visiblePosters[3].posterUrl
                        );
                        setPosterLoading(3, false);
                      }}
                      sizes="(max-width: 768px) 100vw, 308px"
                      priority
                    />
                  </div>
                </>
              )}
              <div className="absolute inset-0 bg-gradient-to-l from-black/100 via-transparent to-transparent pointer-events-none transition-transform duration-300 group-hover:scale-110"></div>
            </div>
          </div>
        </div>
      )}

      {/* 최신 영화 섹션 */}
      <TrendMovies onPosterClick={handlePosterClick} />

      {/* 추천 로딩 모달 */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex justify-center items-center w-full min-h-screen bg-black/90 overflow-y-auto"
          style={{ alignItems: "flex-start", marginTop: "50px" }}
        >
          <div className="bg-[#23272f] w-[75%] h-[70vh] max-w-[98vw] rounded-2xl shadow-2xl flex flex-col text-white my-12 relative">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 z-10 text-red-500 cursor-pointer hover:text-red-400 transition"
              aria-label="Close"
            >
              <IoMdCloseCircle size={36} />
            </button>

            {/* 유튜브 영화 예고편 섹션 */}
            <div className="flex-1 p-6">
              <h3 className="text-xl font-bold mb-5 text-white text-center">
                금주의 추천 영화
              </h3>
              <div className="w-full h-full pb-10 flex justify-center items-center">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/lSCRzeDJxCo?autoplay=1&mute=1"
                  title="영화 예고편"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-lg"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 영화 상세 모달 */}
      {showMovieDetailModal && selectedMovieId && (
        <MovieDetailModal
          setModal={() => {
            setShowMovieDetailModal(false);
            setSelectedMovieId(null);
          }}
          movieId={selectedMovieId}
        />
      )}
    </div>
  );
};

export default RecommenderPage;
