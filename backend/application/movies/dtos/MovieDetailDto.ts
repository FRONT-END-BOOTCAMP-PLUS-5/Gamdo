// 상세정보 dto

export interface MovieDetailDto {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path?: string | null;
  release_date: string;
  genres: { id: number; name: string }[];
  runtime: number | null;
  overview: string;
  credits: CreditsDto | null;
  ott: OttListDto | null;
  certification: CertificationDto | null;
}

export interface MoviePreviewDto {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path?: string;
  ott_providers: string[];
  release_date: string;
  rating: string;
  genres: string[];
  country: string;
  runtime: string;
}

// GET /movie/{movie_id}/watch/providers
export interface OttListDto {
  id: number;
  ott_providers: string[]; // 예: ["Netflix", "Disney Plus"]
}

// 감독/주연만 추출 (GET /movie/{movie_id}/credits)
export interface CreditsDto {
  id: number;
  director: DirectorDto | null;
  main_cast: MainCastDto[];
}

// 감독 dto
export interface DirectorDto {
  id: number;
  name: string;
  profile_path: string | null;
}

// 주연 dto
export interface MainCastDto {
  id: number;
  name: string;
  profile_path: string | null;
}

// 등급 DTO
export interface CertificationDto {
  id: number;
  certification: string; // 등급 (예: "12세 이상 관람가")
}
