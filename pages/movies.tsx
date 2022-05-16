import {
  Button,
  Center,
  Container,
  Group,
  Loader,
  Skeleton,
  TextInput,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { GetStaticPaths, GetStaticProps } from "next";
import React, { useState } from "react";
import useSWR from "swr";
import Show from "../components/Show";
import Filters from "../components/Trending/Filters";
import { MovieType } from "../constants/types";
import fetcher from "../helpers/fetcher";

const URL = `https://api.themoviedb.org/3/discover/movie/?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`;

const MovieSection = ({ page, filters }: { page: number; filters: string }) => {
  const { data } = useSWR(`${URL}${filters}&page=${page}`, fetcher);
  return (
    <>
      {data &&
        data.results.map((data: MovieType) => (
          <Show key={data.id} data={data} />
        ))}
    </>
  );
};
const movies = ({ movies }: { movies: MovieType[] }) => {
  const matches = useMediaQuery("(max-width: 400px)", false);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("");
  const { data: filteredMovies } = useSWR(
    filter ? `${URL}${filter}` : null,
    fetcher
  );

  const pages = [] as React.ReactElement[];
  for (let i = 2; i <= page; i++) {
    pages.push(<MovieSection key={i} page={i} filters={filter} />);
  }

  const handleSearch = (filters: any[]) => {
    console.log(filters, "filters");
    let filtersString = "";

    for (const filter in filters) {
      filtersString += `&${filter}=${filters[filter]}`;
    }

    setFilter(filtersString);
    console.log(filtersString);
  };

  console.log(filteredMovies);

  return (
    <Container size="xl" py={36}>
      <h1>Popular Movies</h1>
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
            {!filter
              ? movies.map((data) => <Show key={data.id} data={data} />)
              : !filteredMovies
              ? [...Array(20)].map((_, i) => (
                  <Skeleton
                    key={i}
                    className="w-[140px] sm:w-[175px]"
                    style={{ aspectRatio: "1 / 1.5" }}
                  />
                ))
              : filteredMovies.results.map((data: MovieType) => (
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
export default movies;

export const getStaticProps = async () => {
  const res = await fetch(URL);

  const { results: movies } = await res.json();

  return {
    props: {
      movies,
    },
    revalidate: 60 * 60 * 24,
  };
};
