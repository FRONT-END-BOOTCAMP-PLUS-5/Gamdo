// 영화 상세정보

export type Movie = {
  id: number;
  media_type: "movie" | "tv";
  title?: string;
  name?: string;
  overview: string;
  poster_path?: string;
  backdrop_path?: string;
  release_date?: string;
  genres: { id: number; name: string }[];
};
