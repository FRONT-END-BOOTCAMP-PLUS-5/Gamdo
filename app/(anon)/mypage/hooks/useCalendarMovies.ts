import { useState, useEffect } from "react";
import axios from "@/utils/axios";
import { CalendarMovieDto } from "@/backend/application/saves/dtos/CalendarDto";

interface UseCalendarMoviesProps {
  year: number;
  month: number;
}

interface UseCalendarMoviesReturn {
  movies: CalendarMovieDto[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useCalendarMovies = ({
  year,
  month,
}: UseCalendarMoviesProps): UseCalendarMoviesReturn => {
  const [movies, setMovies] = useState<CalendarMovieDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCalendarMovies = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/saves?year=${year}&month=${month}`);

      if (response.data.success) {
        setMovies(response.data.movies || []);
      } else {
        setError(
          response.data.message || "캘린더 데이터를 불러오는데 실패했습니다."
        );
      }
    } catch (error) {
      console.error("캘린더 영화 조회 오류:", error);
      setError("캘린더 데이터를 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 년도나 월이 변경될 때마다 데이터 다시 조회
  useEffect(() => {
    fetchCalendarMovies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, month]);

  const refetch = () => {
    fetchCalendarMovies();
  };

  return {
    movies,
    isLoading,
    error,
    refetch,
  };
};
