import {
  MovieDetailDto,
  OttListDto,
  CreditsDto,
  CertificationDto,
} from "@/backend/application/movies/dtos/MovieDetailDto";

export interface MovieRepository {
  getMovieDetailsById(id: number): Promise<MovieDetailDto | null>;
  getCreditsById(id: number): Promise<CreditsDto | null>;
  getOttById(id: number): Promise<OttListDto | null>;
  getCertificationById(id: number): Promise<CertificationDto | null>;
}
