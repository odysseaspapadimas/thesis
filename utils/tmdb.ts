import { MovieDb } from "moviedb-promise";

if (!process.env.NEXT_PUBLIC_TMDB_API_KEY)
  throw Error("NEXT_PUBLIC_TMDB_API_KEY environment variable is not set");

export const tmdb = new MovieDb(process.env.NEXT_PUBLIC_TMDB_API_KEY);
