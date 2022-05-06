import useSWR from "swr";
import fetcher from "../../helpers/fetcher";
import Show from "../Show";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";

export type Movie = {
  title: string;
  overview: string;
  release_date: string;
  vote_average: number;
  id: number;
  poster_path: string;
  backdrop_path: string;
  genres: Genre[];
  runtime: number;
};

export type Genre = {
  id: number;
  name: string;
};

const TrendingShows = () => {
  const { data: shows, error } = useSWR(
    `https://api.themoviedb.org/3/trending/movie/day?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
    fetcher
  );

  console.log(shows);

  return (
    <div className="grid grid-cols-2 place-items-stretch md:grid-cols-5 gap-4 md:gap-2">
      {shows?.results?.map((data: Movie) => (
        <Show key={data.id} data={data} />
      ))}
    </div>
  );
};
export default TrendingShows;
