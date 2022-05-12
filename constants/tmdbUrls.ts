export const MOVIE_URL = (id: string) =>
  `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`;
export const IMG_URL = (path: string | undefined) =>
  `https://image.tmdb.org/t/p/w500${path}`;
