import { Container, Skeleton } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { GetStaticProps } from "next";
import useSWR from "swr";
import Show from "../components/Show";
import { TVShowType } from "../constants/types";
import fetcher from "../helpers/fetcher";

const shows = ({ shows }: { shows: TVShowType[] }) => {
  const matches = useMediaQuery("(max-width: 400px)", false);

  return (
    <Container size="xl" py={36}>
      <h1>Popular TV Shows</h1>
      <div className="flex flex-col md:flex-row">
        <div className="flex-1">filters</div>
        <div className="flex-[3]">
          <div
            className="grid justify-items-center gap-y-2 md:gap-2"
            style={{
              gridTemplateColumns: matches
                ? "repeat(auto-fit, minmax(140px, 1fr))"
                : "repeat(auto-fit, minmax(175px, 1fr))",
            }}
          >
            {shows.map((data: TVShowType) => (
              <Show key={data.id} data={data} />
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
};
export default shows;

export const getStaticProps: GetStaticProps = async () => {
  const URL = `https://api.themoviedb.org/3/trending/tv/day?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`;

  const res = await fetch(URL);

  const { results: shows } = await res.json();

  return {
    props: {
      shows,
    },
    revalidate: 60 * 60 * 24,
  };
};
