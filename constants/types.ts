export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface MovieType {
  adult: boolean;
  backdrop_path: string;
  belongs_to_collection?: any;
  budget: number;
  genres: Genre[];
  homepage: string;
  id: number;
  imdb_id: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface LastEpisodeToAir {
  air_date: string;
  episode_number: number;
  id: number;
  name: string;
  overview: string;
  production_code: string;
  runtime: number;
  season_number: number;
  still_path: string;
  vote_average: number;
  vote_count: number;
}

export interface NextEpisodeToAir {
  air_date: string;
  episode_number: number;
  id: number;
  name: string;
  overview: string;
  production_code: string;
  runtime: number;
  season_number: number;
  still_path?: any;
  vote_average: number;
  vote_count: number;
}

export interface Network {
  name: string;
  id: number;
  logo_path: string;
  origin_country: string;
}

export interface ProductionCompany {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface Season {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  season_number: number;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface TVShowType {
  adult: boolean;
  backdrop_path: string;
  created_by: any[];
  episode_run_time: number[];
  first_air_date: string;
  genres: Genre[];
  homepage: string;
  id: number;
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  last_episode_to_air: LastEpisodeToAir;
  name: string;
  next_episode_to_air?: NextEpisodeToAir;
  networks: Network[];
  number_of_episodes: number;
  number_of_seasons: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  seasons: Season[];
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
  type: string;
  vote_average: number;
  vote_count: number;
}

export type Airs = {
  day: string;
  time: string;
  timezone: string;
};

export interface ListData {
  movies: MovieType[];
  shows: TVShowType[];
}

export interface RequestParams {
  id?: string | number;
  language?: string;
}

export interface DiscoverTvRequest extends RequestParams {
  sort_by?: string;
  "air_date.gte"?: string;
  "air_date.lte"?: string;
  "first_air_date.gte"?: string;
  "first_air_date.lte"?: string;
  first_air_date_year?: number;
  page?: number;
  timezone?: string;
  "vote_average.gte"?: number;
  "vote_average.lte"?: number;
  "vote_count.gte"?: number;
  with_genres?: string;
  with_networks?: string;
  without_genres?: string;
  "with_runtime.gte"?: number;
  "with_runtime.lte"?: number;
  include_null_first_air_dates?: boolean;
  with_original_language?: string;
  without_keywords?: string;
  screened_theatrically?: boolean;
  with_companies?: string;
  with_keywords?: string;
  with_watch_providers?: string;
  watch_region?: string;
  with_watch_monetization_types?: string;
}

export interface CreditCast {
  id?: number;
  original_language?: string;
  episode_count?: number;
  overview?: string;
  origin_country?: string[];
  original_name?: string;
  genre_ids?: number[];
  name?: string;
  media_type?: string;
  poster_path?: string | null;
  first_air_date?: string;
  vote_average?: number | number;
  vote_count?: number;
  character?: string;
  backdrop_path?: string | null;
  popularity?: number;
  credit_id?: string;
  original_title?: string;
  video?: boolean;
  release_date?: string;
  title?: string;
  adult?: boolean;
}
export interface CreditCrew {
  id?: number;
  department?: string;
  original_language?: string;
  episode_count?: number;
  job?: string;
  overview?: string;
  origin_country?: string[];
  original_name?: string;
  vote_count?: number;
  name?: string;
  media_type?: string;
  popularity?: number;
  credit_id?: string;
  backdrop_path?: string | null;
  first_air_date?: string;
  vote_average?: number;
  genre_ids?: number[];
  poster_path?: string | null;
  original_title?: string;
  video?: boolean;
  title?: string;
  adult?: boolean;
  release_date?: string;
}

export interface Role {
  credit_id: string;
  character: string;
  episode_count: number;
}

export interface AggregateCast {
  adult?: boolean;
  gender?: number;
  id?: number;
  known_for_department?: string;
  name?: string;
  original_name?: string;
  popularity?: number;
  profile_path?: string;
  roles?: Role[];
  total_episode_count?: number;
  order?: number;
}

export interface AggregateJob {
  credit_id?: string;
  job?: string;
  episode_count?: number;
}

export interface AggregateCrew {
  adult?: boolean;
  gender?: number;
  id?: number;
  known_for_department?: string;
  name?: string;
  original_name?: string;
  popularity?: number;
  profile_path?: string;
  jobs?: AggregateJob[];
  department?: string;
  total_episode_count?: number;
}

export interface AggregateCredits {
  cast?: Array<AggregateCast>;
  crew?: Array<AggregateCrew>;
  id?: number;
}

export type ListItem = {
  id: string;
  type: "movie" | "show";
};

export type RatingItem = {
  id: string;
  type: "movie" | "show";
  rating: number;
  review: string;
};

export interface Message extends Record<string, any> {
  text?: string;
  sent: Date;
  me: boolean;
  read: { state: boolean; at: string };
  media_type?: "movie" | "show" | "person";
  media_id?: string;
  media_name?: string;
  image_path?: string;
}

export interface User {
  username: string;
  email: string;
  password?: string;
  image_url: string;
  created_at: string;
  watched?: ListItem[];
  plan_to?: ListItem[];
  favorites?: ListItem[];
  following?: string[];
  followers?: string[];
  messages?: Record<string, Message[]>;
  activity?: any;
  ratings?: RatingItem[];
}

export interface Activity {
  createdAt: Date;
  type: string;
  user: {
    username: string;
    image_url: string;
  };
  media: {
    id: string;
    media_name: string;
    image_path: string;
    type: "movie" | "show";
  };
}
