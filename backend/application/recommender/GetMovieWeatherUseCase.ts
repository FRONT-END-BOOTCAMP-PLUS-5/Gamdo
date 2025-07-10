import { WeatherRepository } from "../../domain/repositories/recommender/weather";
import {
  WeatherRequest,
  WeatherResponse,
} from "../../domain/entities/recommender/weather";

/**
 * 날씨 정보를 조회하는 UseCase
 */
export class GetMovieWeatherUseCase {
  constructor(private weatherRepository: WeatherRepository) {}

  /**
   * 좌표를 기반으로 현재 날씨 정보 조회
   * @param nx X좌표 (기본값: 60)
   * @param ny Y좌표 (기본값: 127)
   * @returns 날씨 데이터 조회 결과
   */
  async execute(nx: number = 60, ny: number = 127): Promise<WeatherResponse> {
    try {
      const weatherRequest = this.createWeatherRequest(nx, ny);
      const result = await this.weatherRepository.getWeatherData(
        weatherRequest
      );
      return result;
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "날씨 정보 조회 중 오류가 발생했습니다",
      };
    }
  }

  /**
   * 현재 날짜와 시간을 기준으로 날씨 조회 요청을 생성
   * @param nx X좌표
   * @param ny Y좌표
   * @returns 날씨 조회 요청 객체
   */
  private createWeatherRequest(nx: number, ny: number): WeatherRequest {
    const now = new Date();

    // 현재 시간에서 40분 전 시간 계산 (기상청 API 특성상)
    const targetTime = new Date(now.getTime() - 40 * 60 * 1000);

    // 날짜 형식 변환 (YYYYMMDD)
    const year = targetTime.getFullYear();
    const month = String(targetTime.getMonth() + 1).padStart(2, "0");
    const day = String(targetTime.getDate()).padStart(2, "0");
    const baseDate = `${year}${month}${day}`;

    // 30분 단위로 가장 가까운 시간 계산
    const baseTime = this.calculateBaseTime(targetTime);

    return {
      baseDate,
      baseTime,
      nx,
      ny,
    };
  }

  /**
   * 30분 단위로 가장 가까운 시간을 계산 (HHMM 형식)
   * @param targetTime 목표 시간
   * @returns 30분 단위로 내림차순 정렬된 시간
   */
  private calculateBaseTime(targetTime: Date): string {
    const hour = targetTime.getHours();
    const minute = targetTime.getMinutes();

    // 30분 단위로 내림차순 정렬
    const baseMinute = minute >= 30 ? 30 : 0;

    return `${hour.toString().padStart(2, "0")}${baseMinute
      .toString()
      .padStart(2, "0")}`;
  }
}
