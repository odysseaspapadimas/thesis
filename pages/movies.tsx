import { Container, Group } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import useSWR from "swr";
import Show from "../components/Show";
import { MovieType } from "../constants/types";
import fetcher from "../helpers/fetcher";

const movies = () => {
  const { data: shows, error } = useSWR(
    `https://api.themoviedb.org/3/trending/movie/day?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
    fetcher
  );
  const matches = useMediaQuery('(max-width: 400px)', false);

  return (
    <Container size="xl" py={36}>
      <h1>Popular Movies</h1>
      <div className="flex flex-col md:flex-row">
        <div className="flex-1">filters</div>
        <div className="flex-[3]">
          <div
            className="grid justify-items-center gap-y-2 md:gap-2"
            style={{
              gridTemplateColumns: matches ? "repeat(auto-fit, minmax(140px, 1fr))" : "repeat(auto-fit, minmax(175px, 1fr))",
            }}
          >
            {shows?.results?.map((data: MovieType) => (
              <Show key={data.id} data={data} />
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
};
export default movies;
