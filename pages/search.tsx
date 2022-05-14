import {
  Button,
  Center,
  Container,
  Loader,
  Pagination,
  Skeleton,
} from "@mantine/core";
import { useMediaQuery, useWindowScroll } from "@mantine/hooks";
import { NextLink } from "@mantine/next";
import { MovieResult, TvResult } from "moviedb-promise/dist/request-types";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import useSWR from "swr";
import Person from "../components/Search/Results/Person";
import Show from "../components/Search/Results/Show";
import fetcher from "../helpers/fetcher";

const URL = `https://api.themoviedb.org/3/search/multi?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=`;

export interface PersonResult {
  adult: boolean;
  gender: number;
  id: number;
  known_for: [];
  known_for_department: string;
  media_type: "person";
  name: string;
  popularity: number;
  profile_path: string;
}

interface SearchMultiResponse {
  results: Array<MovieResult | TvResult | PersonResult>;
  total_results: number;
  total_pages: number;
}

const search = ({ serverData }: { serverData: SearchMultiResponse }) => {
  const router = useRouter();
  const { query, page } = router.query;

  const matches = useMediaQuery("(max-width: 400px)", false);

  const [activePage, setPage] = useState(page ? parseInt(String(page)) : 1);

  const { data, error } = useSWR<SearchMultiResponse>(
    `${URL}${query}&page=${activePage === 1 ? 2 : activePage}`, //fetch the 2nd page before you switch
    fetcher
  );

  const [scroll, scrollTo] = useWindowScroll();

  return (
    <Container size="xl" py={36}>
      <h2 className="text-xl mb-6">
        Found {serverData.total_results} results for "{query}"
      </h2>

      <Center className="my-6">
        <Pagination
          classNames={{
            item: matches ? "px-1 h-7 w-7 min-w-[unset]" : "",
            active: "bg-primary",
          }}
          total={serverData.total_pages}
          page={activePage}
          onChange={(page) => {
            {
              setPage(page);
            }
          }}
        />
      </Center>
      <div className="flex flex-col space-y-4">
        {activePage === 1
          ? serverData.results?.map((result) => {
              if (result.media_type === "person") {
                console.log(result);
                return <Person key={result.id} result={result} />;
              } else {
                return <Show key={result.id} result={result} />;
              }
            })
          : !data && !error
          ? [...Array(20)].map(() => (
              <Skeleton width={315} height={152} className="rounded-md" />
            ))
          : data?.results?.map((result) => {
              if (result.media_type === "person") {
                console.log(result);
                return <Person key={result.id} result={result} />;
              } else {
                return <Show key={result.id} result={result} />;
              }
            })}
      </div>

      <Center className="mt-6">
        <Pagination
          classNames={{
            item: matches ? "px-1 h-7 w-7 min-w-[unset]" : "",
            active: "bg-primary",
          }}
          total={serverData.total_pages}
          page={activePage}
          onChange={(page) => {
            {
              setPage(page);
              scrollTo({y: 0})
            }
          }}
        />
      </Center>
    </Container>
  );
};
export default search;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { query } = ctx.query;

  const res = await fetch(URL + query);

  const serverData = await res.json();

  return {
    props: {
      serverData,
    },
  };
};
