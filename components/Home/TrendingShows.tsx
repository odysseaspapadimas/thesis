import useSWR from "swr";
import fetcher from "../../helpers/fetcher";
import Movie from "../Movie";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { MovieType, TVShowType } from "../../constants/types";
import Show from "../Show";
import { Group } from "@mantine/core";
import { NextLink } from "@mantine/next";

const TrendingShows = () => {
  const { data: shows, error } = useSWR(
    `https://api.themoviedb.org/3/trending/tv/day?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
    fetcher
  );

  console.log(shows);

  return (
    <div>
      <Group position="apart" className="border-b border-gray-600 mb-3">
        <h2 className="font-semibold text-lg">Trending TV Shows</h2>
        <NextLink href="shows" className="text-gray-300 text-sm hover:text-primary">See more</NextLink>
      </Group>

      <div className="grid grid-cols-2 place-items-stretch md:grid-cols-6 gap-4 md:gap-2">
        {shows?.results
          ?.map((data: TVShowType) => <Show key={data.id} data={data} />)
          .slice(0, 6)}
      </div>
    </div>
  );
};
export default TrendingShows;
