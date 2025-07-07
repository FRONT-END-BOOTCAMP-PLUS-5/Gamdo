/**
 * 기상청 격자 좌표 변환 유틸리티
 * 위도/경도를 기상청 격자 좌표(nx, ny)로 변환합니다
 */

// 기상청 격자 좌표계 상수
const RE = 6371.00877; // 지구 반경(km)
const GRID = 5.0; // 격자 간격(km)
const SLAT1 = 30.0; // 투영 위도1(degree)
const SLAT2 = 60.0; // 투영 위도2(degree)
const OLON = 126.0; // 기준점 경도(degree)
const OLAT = 38.0; // 기준점 위도(degree)
const XO = 43; // 기준점 X좌표(GRID)
const YO = 136; // 기준점 Y좌표(GRID)

// 좌표 타입 정의
export interface LatLng {
  lat: number;
  lng: number;
}

export interface GridXY {
  nx: number;
  ny: number;
}

/**
 * 위도/경도를 기상청 격자 좌표로 변환
 * @param lat 위도
 * @param lng 경도
 * @returns 격자 좌표 {nx, ny}
 */
export function convertToGrid(lat: number, lng: number): GridXY {
  const DEGRAD = Math.PI / 180.0;

  const re = RE / GRID;
  const slat1 = SLAT1 * DEGRAD;
  const slat2 = SLAT2 * DEGRAD;
  const olon = OLON * DEGRAD;
  const olat = OLAT * DEGRAD;

  let sn =
    Math.tan(Math.PI * 0.25 + slat2 * 0.5) /
    Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
  let sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sf = (Math.pow(sf, sn) * Math.cos(slat1)) / sn;
  let ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
  ro = (re * sf) / Math.pow(ro, sn);

  let ra = Math.tan(Math.PI * 0.25 + lat * DEGRAD * 0.5);
  ra = (re * sf) / Math.pow(ra, sn);
  let theta = lng * DEGRAD - olon;
  if (theta > Math.PI) theta -= 2.0 * Math.PI;
  if (theta < -Math.PI) theta += 2.0 * Math.PI;
  theta *= sn;

  const nx = Math.floor(ra * Math.sin(theta) + XO + 0.5);
  const ny = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);

  return { nx, ny };
}

/**
 * 격자 좌표를 위도/경도로 변환 (역변환)
 * @param nx X 격자 좌표
 * @param ny Y 격자 좌표
 * @returns 위도/경도 {lat, lng}
 */
export function convertToLatLng(nx: number, ny: number): LatLng {
  const DEGRAD = Math.PI / 180.0;
  const RADDEG = 180.0 / Math.PI;

  const re = RE / GRID;
  const slat1 = SLAT1 * DEGRAD;
  const slat2 = SLAT2 * DEGRAD;
  const olon = OLON * DEGRAD;
  const olat = OLAT * DEGRAD;

  let sn =
    Math.tan(Math.PI * 0.25 + slat2 * 0.5) /
    Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
  let sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sf = (Math.pow(sf, sn) * Math.cos(slat1)) / sn;
  let ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
  ro = (re * sf) / Math.pow(ro, sn);

  const xn = nx - XO;
  const yn = ro - ny + YO;
  const ra = Math.sqrt(xn * xn + yn * yn);
  let alat = Math.pow((re * sf) / ra, 1.0 / sn);
  alat = 2.0 * Math.atan(alat) - Math.PI * 0.5;

  let theta = 0.0;
  if (Math.abs(xn) <= 0.0) {
    theta = 0.0;
  } else {
    if (Math.abs(yn) <= 0.0) {
      theta = Math.PI * 0.5;
      if (xn < 0.0) theta = -theta;
    } else theta = Math.atan2(xn, yn);
  }
  const alon = theta / sn + olon;

  return {
    lat: alat * RADDEG,
    lng: alon * RADDEG,
  };
}
