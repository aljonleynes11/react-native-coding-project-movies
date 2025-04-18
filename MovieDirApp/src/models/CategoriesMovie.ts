import { Movie } from "./Movie";

export interface CategoryMovies {
  categoryId: string;
  movies: Movie[];
  loading: boolean;
  error: string | null;
}