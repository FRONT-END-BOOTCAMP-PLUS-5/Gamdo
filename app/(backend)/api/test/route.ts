import { NextResponse } from "next/server";

const SERVICE_KEY =
  "NZOX0w0OscAPHIWjLw9vdDDwURUMPSWFDgzLWGiODScQmxqyoD19YLJyXGEYIDux50%2FjxkloUorcEzQrnS80zg%3D%3D";
const BASE_URL =
  "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst";

export async function GET() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const baseDate = `${yyyy}${mm}${dd}`;
  const baseTime = "0500"; // 또는 현재 시각 기준 가장 가까운 발표 시간

  const url = `${BASE_URL}?serviceKey=${SERVICE_KEY}&pageNo=1&numOfRows=10&dataType=JSON&base_date=${baseDate}&base_time=${baseTime}&nx=60&ny=127`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch weather data" },
        { status: 500 }
      );
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
