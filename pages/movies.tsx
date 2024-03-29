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
import { DiscoverMovieRequest } from "moviedb-promise";
import Sort from "../components/Trending/Sort";
import { tmdb } from "../utils/tmdb";
import { Genre } from "moviedb-promise/dist/types";
import Head from "next/head";
import dayjs from "dayjs";
import { useRouter } from "next/router";

const MovieSection = ({ page, url }: { page: number; url: string }) => {
  const { data } = useSWR(`${url}&page=${page}`, fetcher);

  return (
    <>
      {data &&
        data.results.map((data: MovieType) => (
          <Show key={data.id} data={data} />
        ))}
    </>
  );
};
const movies = ({ movies, genresList }: { movies: MovieType[]; genresList: Array<Genre> }) => {

  const matches = useMediaQuery("(max-width: 400px)", false);
  const [page, setPage] = useState(1);

  const [sortBy, setSortBy] =
    useState<DiscoverMovieRequest["sort_by"]>("popularity.desc");

  const [filter, setFilter] = useState("");

  const [url, setUrl] = useState(
    `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}${filter}&sort_by=${sortBy}`
  );

  const { data: filteredMovies } = useSWR(`${url}`, fetcher);

  const pages = [] as React.ReactElement[];
  for (let i = 2; i <= page; i++) {
    pages.push(<MovieSection key={i} page={i} url={url} />);
  }

  const [filters, setFilters] = useState<DiscoverMovieRequest>({
    "vote_average.gte": 0.0,
    "vote_average.lte": 10.0,
    "primary_release_date.lte": dayjs(new Date()).format("YYYY-MM-DD"),
    "include_adult": false
  });

  const handleSearch = () => {
    let filtersString = "";
    let filtersKeys = Object.keys(filters) as Array<keyof DiscoverMovieRequest>;

    for (const filter of filtersKeys) {
      filtersString += `&${filter}=${filters[filter]}`;
    }

    console.log(filters["with_genres"], 'filtergenres')

    setFilter(filtersString);
    setUrl(
      `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}${filtersString}&sort_by=${sortBy}`
    );
  };

  console.log(filteredMovies, 'ez');

  return (
    <Container py={36}>
      <Head>
        <title>Popular Movies</title>
      </Head>
      <h1>Popular Movies</h1>
      <div className="flex flex-col md:flex-row md:space-x-4">
        <div className="flex flex-col flex-1 space-y-2 mb-4">
          <Sort sortBy={sortBy} setSortBy={setSortBy} type="movies" />
          <Filters filters={filters} setFilters={setFilters} genresList={genresList} handleSearch={handleSearch} type="movies" />
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
                : "repeat(auto-fit, minmax(150px, 1fr))",
            }}
          >
            {!filter
              ? movies.map((data) => <Show key={data.id} data={data} />)
              : !filteredMovies
                ? [...Array(20)].map((_, i) => (
                  <Skeleton
                    key={i}
                    className="w-[140px] sm:w-[150px]"
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
  const URL = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`;

  const res = await fetch(URL);

  const { results: movies } = await res.json();

  const { genres: genresList } = await tmdb.genreMovieList();

  return {
    props: {
      movies,
      genresList
    },
    revalidate: 60 * 60 * 24,
  };
};
