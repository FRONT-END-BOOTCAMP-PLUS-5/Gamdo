"use client";

import { useState, useCallback } from "react";
import {
  convertToGrid,
  type LatLng,
  type GridXY,
} from "./coordinate-converter";
import {
  getCurrentPosition,
  getAddressFromCoordinates,
  type AddressInfo,
} from "./geolocation";
import type { ParsedWeatherInfo } from "../../../backend/domain/entities/recommenders/weather";

// 위치 기반 날씨 정보 상태 타입
export interface WeatherLocationState {
  isLoading: boolean;
  error: string | null;
  position: LatLng | null;
  gridCoordinates: GridXY | null;
  address: AddressInfo | null;
  weatherData: ParsedWeatherInfo | null;
}

// 위치 기반 날씨 정보 훅
export function useWeatherLocation() {
  const [state, setState] = useState<WeatherLocationState>({
    isLoading: false,
    error: null,
    position: null,
    gridCoordinates: null,
    address: null,
    weatherData: null,
  });

  /**
   * 현재 위치를 가져와서 날씨 정보를 조회합니다
   */
  const getLocationWeather = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    try {
      // 1단계: 현재 위치 가져오기
      const position = await getCurrentPosition();
      const gridCoordinates = convertToGrid(position.lat, position.lng);

      setState((prev) => ({
        ...prev,
        position,
        gridCoordinates,
      }));

      // 2단계: 주소 정보 가져오기
      const address = await getAddressFromCoordinates(position);

      setState((prev) => ({
        ...prev,
        address,
      }));

      // 3단계: 날씨 정보 조회
      const weatherData = await fetchWeatherData(gridCoordinates);

      setState((prev) => ({
        ...prev,
        weatherData,
        isLoading: false,
      }));

      return {
        position,
        gridCoordinates,
        address,
        weatherData,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "위치 기반 날씨 정보를 가져올 수 없습니다.";

      setState((prev) => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
      }));

      throw error;
    }
  }, []);

  /**
   * 상태 초기화
   */
  const reset = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      position: null,
      gridCoordinates: null,
      address: null,
      weatherData: null,
    });
  }, []);

  return {
    ...state,
    getLocationWeather,
    reset,
  };
}

/**
 * 격자 좌표로 날씨 정보를 가져옵니다
 * @param gridCoordinates 기상청 격자 좌표
 * @returns Promise<ParsedWeatherInfo> 날씨 데이터
 */
export async function fetchWeatherData(
  gridCoordinates: GridXY
): Promise<ParsedWeatherInfo> {
  const response = await fetch(
    `/api/weathers?nx=${gridCoordinates.nx}&ny=${gridCoordinates.ny}`
  );

  if (!response.ok) {
    throw new Error(`날씨 정보 조회 실패: ${response.status}`);
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || "날씨 정보 조회에 실패했습니다.");
  }

  return data.weatherInfo;
}

/**
 * 간단한 위치 기반 날씨 조회 함수 (훅 없이 사용)
 * @returns Promise<WeatherLocationResult> 위치 + 날씨 정보
 */
export async function getLocationWeatherData() {
  const position = await getCurrentPosition();
  const gridCoordinates = convertToGrid(position.lat, position.lng);
  const address = await getAddressFromCoordinates(position);
  const weatherData = await fetchWeatherData(gridCoordinates);

  return {
    position,
    gridCoordinates,
    address,
    weatherData,
  };
}

// 위치 + 날씨 정보 결과 타입
export interface WeatherLocationResult {
  position: LatLng;
  gridCoordinates: GridXY;
  address: AddressInfo;
  weatherData: ParsedWeatherInfo;
}
