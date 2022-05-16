import {
  Button,
  Center,
  Container,
  Group,
  Loader,
  Skeleton,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { GetStaticPaths, GetStaticProps } from "next";
import { useState } from "react";
import useSWR from "swr";
import Show from "../components/Show";
import Filters from "../components/Trending/Filters";
import { TVShowType } from "../constants/types";
import fetcher from "../helpers/fetcher";
import { tmdb } from "../utils/tmdb";

const URL = `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`;

const ShowSection = ({ page, filters }: { page: number; filters: string }) => {
  const { data } = useSWR(`${URL}${filters}&page=${page}`, fetcher);
  if (!data)
    return <Loader className="absolute left-1/2 -translate-x-1/2 bottom-0" />;
  return (
    <>
      {data.results.map((data: TVShowType) => (
        <Show key={data.id} data={data} />
      ))}
    </>
  );
};

const shows = ({ shows }: { shows: TVShowType[] }) => {
  const matches = useMediaQuery("(max-width: 400px)", false);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState("");

  const { data: filteredShows } = useSWR(
    filters ? `${URL}${filters}` : null,
    fetcher
  );

  const pages = [] as React.ReactElement[];
  for (let i = 2; i <= page; i++) {
    pages.push(<ShowSection key={i} page={i} filters={filters} />);
  }

  const handleSearch = (filters: any[]) => {
    console.log(filters, "filters");
    let filtersString = "";

    for (const filter in filters) {
      filtersString += `&${filter}=${filters[filter]}`;
    }

    setFilters(filtersString);
    console.log(filtersString);
  };

  return (
    <Container size="xl" py={36}>
      <h1>Popular TV Shows</h1>
      <div className="flex flex-col md:flex-row">
        <Filters handleSearch={handleSearch} />
        <div className="flex-[3]">
          <div
            className="relative grid justify-items-center gap-y-2 md:gap-2"
            style={{
              gridTemplateColumns: matches
                ? "repeat(auto-fit, minmax(140px, 1fr))"
                : "repeat(auto-fit, minmax(175px, 1fr))",
            }}
          >
            {!filters
              ? shows.map((data) => <Show key={data.id} data={data} />)
              : !filteredShows
              ? [...Array(20)].map((_, i) => (
                  <Skeleton
                    key={i}
                    className="w-[140px] sm:w-[175px]"
                    style={{ aspectRatio: "1 / 1.5" }}
                  />
                ))
              : filteredShows.results.map((data: TVShowType) => (
                  <Show key={data.id} data={data} />
                ))}

            {pages}
          </div>
          <Center>
            <Button
              onClick={() => setPage((page) => page + 1)}
              mt={16}
              className="bg-primary"
              variant="filled"
              size="lg"
            >
              Load More
            </Button>
          </Center>
        </div>
      </div>
    </Container>
  );
};
export default shows;

export const getStaticProps = async () => {
  const res = await fetch(URL);

  const { results: shows } = await res.json();

  return {
    props: {
      shows,
    },
    revalidate: 60 * 60 * 24,
  };
};
