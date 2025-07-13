/**
 * 좌표 정보
 */
export interface CoordinateInfo {
  latitude: number;
  longitude: number;
}

/**
 * 주소 정보
 */
export interface AddressInfo {
  sido: string; // 시/도 (예: "서울특별시")
  sigungu: string; // 시/군/구 (예: "강남구")
  dong: string; // 읍/면/동 (예: "역삼동")
  fullAddress: string; // 전체 주소 (예: "서울특별시 강남구 역삼동")
}

/**
 * 지오코딩 정보 (좌표 + 주소)
 */
export interface GeocodeInfo {
  coordinates: CoordinateInfo;
  address: AddressInfo;
  timestamp: string;
}

/**
 * 지오코딩 요청 정보
 */
export interface GeocodeRequest {
  latitude: number;
  longitude: number;
}

/**
 * 지오코딩 응답 정보
 */
export interface GeocodeResponse {
  success: boolean;
  data?: GeocodeInfo;
  error?: string;
  timestamp: string;
}
