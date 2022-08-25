import {
  Button,
  Center,
  Container,
  Group,
  Loader,
  Skeleton,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { DiscoverTvRequest } from "../constants/types";
import { Genre } from "moviedb-promise/dist/types";
import { GetStaticPaths, GetStaticProps } from "next";
import { useState } from "react";
import useSWR from "swr";
import Show from "../components/Show";
import Filters from "../components/Trending/Filters";
import Sort from "../components/Trending/Sort";
import { TVShowType } from "../constants/types";
import fetcher from "../helpers/fetcher";
import { tmdb } from "../utils/tmdb";
import Head from "next/head";

const URL = `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`;

const ShowSection = ({ page, url }: { page: number; url: string }) => {
  const { data } = useSWR(`${url}&page=${page}`, fetcher);
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

const shows = ({ shows, genres }: { shows: TVShowType[]; genres: Array<Genre> }) => {
  const matches = useMediaQuery("(max-width: 400px)", false);
  const [page, setPage] = useState(1);

  const [sortBy, setSortBy] =
    useState<DiscoverTvRequest["sort_by"]>("popularity.desc");

  const [filter, setFilter] = useState("");

  const [url, setUrl] = useState(
    `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}${filter}&sort_by=${sortBy}`
  );

  const { data: filteredShows } = useSWR(`${url}`, fetcher);

  console.log(url, "filterulr");

  const pages = [] as React.ReactElement[];
  for (let i = 2; i <= page; i++) {
    pages.push(<ShowSection key={i} page={i} url={url} />);
  }

  const [filters, setFilters] = useState<DiscoverTvRequest>({
    "vote_average.gte": 0.0,
    "vote_average.lte": 10.0,
  });

  const handleSearch = () => {
    console.log(filters, "filters");
    let filtersString = "";
    let filtersKeys = Object.keys(filters) as Array<keyof DiscoverTvRequest>;

    for (const filter of filtersKeys) {
      filtersString += `&${filter}=${filters[filter]}`;
    }

    setFilter(filtersString);
    setUrl(
      `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}${filtersString}&sort_by=${sortBy}`
    );
  };

  return (
    <Container size="xl" py={36}>
      <Head>
        <title>Popular TV Shows</title>
      </Head>
      <h1>Popular TV Shows</h1>
      <div className="flex flex-col md:flex-row justify-center">
        <div className="flex flex-col space-y-2 mb-4">
          <Sort sortBy={sortBy} setSortBy={setSortBy} />
          <Filters filters={filters} setFilters={setFilters} genres={genres} type="show" />
          <Button onClick={handleSearch} className="bg-primary">
            Filter
          </Button>
        </div>
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

  const { genres } = await tmdb.genreTvList();

  return {
    props: {
      shows,
      genres
    },
    revalidate: 60 * 60 * 24,
  };
};
