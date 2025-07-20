import { AddressInfo } from "../../../domain/entities/recommenders/geocode";

/**
 * 역지오코딩 요청 DTO
 * 좌표 정보를 받아 주소를 반환하는 요청
 */
export interface GetAddressFromCoordinatesRequestDto {
  latitude: number;
  longitude: number;
}

/**
 * 역지오코딩 응답 DTO
 * 주소 정보를 포함한 응답
 */
export interface GetAddressFromCoordinatesResponseDto {
  success: boolean;
  data?: AddressInfo;
  error?: string;
  timestamp: string;
}
