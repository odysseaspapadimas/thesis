import { MovieType } from "../../constants/types";
import Show from "../Show";
import { Group, Skeleton } from "@mantine/core";
import { NextLink } from "@mantine/next";

const TrendingMovies = ({ movies }: { movies: MovieType[] }) => {

  return (
    <div>
      <Group position="apart" className="border-b border-gray-600 mb-3">
        <h2 className="font-semibold text-lg">Trending Movies</h2>
        <NextLink
          href="movies"
          className="text-gray-300 text-sm hover:text-primary"
        >
          See more
        </NextLink>
      </Group>

      <div className="grid justify-items-center gap-y-3 md:space-y-0 w-full grid-cols-2 md:grid-cols-5 md:gap-2">
        {movies
          .map((data: MovieType) => <Show key={data.id} data={data} />)
          .slice(0, 5)}
      </div>
    </div>
  );
};
export default TrendingMovies;
