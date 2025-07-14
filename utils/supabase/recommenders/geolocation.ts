"use client";

import type { LatLng } from "./coordinate-converter";

// 주소 정보 타입
export interface AddressInfo {
  city: string; // 시/도 (서울특별시, 광주광역시 등)
  district: string; // 구/군 (강남구, 서구 등)
  fullAddress: string; // 전체 주소
}

/**
 * Geolocation API를 사용하여 현재 위치를 가져옵니다
 * @returns Promise<LatLng> 위도, 경도 좌표
 */
export function getCurrentPosition(): Promise<LatLng> {
  return new Promise((resolve, reject) => {
    // Geolocation API 지원 확인
    if (!navigator.geolocation) {
      reject(new Error("이 브라우저는 위치 정보를 지원하지 않습니다."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        let errorMessage = "위치 정보를 가져올 수 없습니다.";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              "위치 정보 접근이 거부되었습니다. 브라우저 설정에서 위치 권한을 허용해주세요.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "위치 정보를 사용할 수 없습니다.";
            break;
          case error.TIMEOUT:
            errorMessage = "위치 정보 요청 시간이 초과되었습니다.";
            break;
        }

        reject(new Error(errorMessage));
      },
      {
        enableHighAccuracy: true, // 정확한 위치 요청
        timeout: 10000, // 10초 타임아웃
        maximumAge: 300000, // 5분간 캐시 사용
      }
    );
  });
}

/**
 * 좌표로부터 주소 정보를 가져옵니다 (OpenStreetMap Nominatim API 사용)
 * @param position 위도, 경도 좌표
 * @returns Promise<AddressInfo> 주소 정보
 */
export async function getAddressFromCoordinates(
  position: LatLng
): Promise<AddressInfo> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${position.lat}&lon=${position.lng}&format=json&accept-language=ko`
    );

    if (!response.ok) {
      throw new Error(`주소 조회 실패: ${response.status}`);
    }

    const data = await response.json();

    // OpenStreetMap Nominatim 응답에서 한국 주소 정보 추출
    const address = data.address || {};

    // 시/도 정보 추출
    let city = "";
    if (address.city) {
      city = address.city;
    } else if (address.province) {
      city = address.province;
    } else if (address.state) {
      city = address.state;
    } else if (address.county) {
      city = address.county;
    }

    // 구/군 정보 추출
    let district = "";
    if (address.borough) {
      district = address.borough;
    } else if (address.district) {
      district = address.district;
    } else if (address.municipality) {
      district = address.municipality;
    } else if (address.town) {
      district = address.town;
    }

    // 전체 주소
    const fullAddress = data.display_name || "주소를 찾을 수 없습니다";

    return {
      city: city || "정보없음",
      district: district || "정보없음",
      fullAddress: fullAddress,
    };
  } catch {
    return {
      city: "주소조회실패",
      district: "주소조회실패",
      fullAddress: "주소를 가져올 수 없습니다",
    };
  }
}
