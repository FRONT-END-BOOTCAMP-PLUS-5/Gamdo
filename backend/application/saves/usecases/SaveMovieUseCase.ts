import { SavedMovie } from "../../../domain/entities/saves/SavedMovie";
import { SavedMovieRepository } from "../../../domain/repositories/saves/SavedMovieRepository";
import {
  SaveMovieRequestDto,
  SaveMovieResponseDto,
} from "../dtos/SaveMovieDto";
import axios from "axios";

export class SaveMovieUseCase {
  constructor(private savedMovieRepository: SavedMovieRepository) {}

  /**
   * 영화 저장 로직 실행
   * @param userId 사용자 ID (JWT 토큰에서 추출된)
   * @param data 영화 저장 요청 데이터
   * @returns 영화 저장 결과
   */
  async execute(
    userId: string,
    data: SaveMovieRequestDto
  ): Promise<SaveMovieResponseDto> {
    try {
      const { movieId, selectedDate } = data;

      // 1. 날짜 형식 검증 (YYYY-MM-DD)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(selectedDate)) {
        return {
          success: false,
          message:
            "날짜 형식이 올바르지 않습니다. (YYYY-MM-DD 형식을 사용하세요)",
        };
      }

      // 2. TMDB API에서 영화 포스터 이미지 URL 가져오기
      let posterImageUrl = "";
      try {
        console.log(`🎬 영화 포스터 정보 요청: movieId=${movieId}`);

        const TMDB_API_KEY = process.env.TMDB_API_KEY;
        const TMDB_BASE_URL = "https://api.themoviedb.org/3";

        if (!TMDB_API_KEY) {
          throw new Error("TMDB_API_KEY가 설정되지 않았습니다.");
        }

        const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}`, {
          params: {
            api_key: TMDB_API_KEY,
            language: "ko-KR",
          },
        });

        const posterPath = response.data.poster_path;
        posterImageUrl = posterPath
          ? `https://image.tmdb.org/t/p/w500${posterPath}`
          : "";

        console.log(`🖼️ 포스터 정보 조회 결과:`, {
          movieId,
          title: response.data.title,
          posterPath,
          posterImageUrl,
        });

        if (!posterImageUrl) {
          return {
            success: false,
            message: "영화 포스터 정보를 가져올 수 없습니다.",
          };
        }
      } catch (error) {
        console.error("TMDB API 호출 오류:", error);
        return {
          success: false,
          message: "영화 정보를 가져오는 중 오류가 발생했습니다.",
        };
      }

      // 3. SavedMovie 엔티티 생성
      const savedMovie = new SavedMovie(
        userId,
        movieId,
        selectedDate,
        posterImageUrl
      );

      // 4. 데이터베이스에 저장
      const result = await this.savedMovieRepository.save(savedMovie);

      return {
        success: true,
        message: "영화가 성공적으로 저장되었습니다.",
        savedMovie: {
          savedMovieId: result.savedMovieId!,
          userId: result.userId,
          movieId: result.movieId,
          selectedDate: result.selectedDate,
          posterImageUrl: result.posterImageUrl,
          createdAt: result.createdAt!,
        },
      };
    } catch (error) {
      console.error("SaveMovieUseCase 실행 중 오류:", error);
      return {
        success: false,
        message: "영화 저장 중 오류가 발생했습니다.",
      };
    }
  }
}
