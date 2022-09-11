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
import { MovieResult, TvResult } from "moviedb-promise";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import useSWR from "swr";
import Person from "../components/Search/Results/Person";
import Show from "../components/Search/Results/Show";
import User from "../components/Search/Results/User";
import { User as IUser } from "../constants/types";
import fetcher from "../helpers/fetcher";
import dbConnect from "../lib/dbConnect";
import UserModel from "../models/User";
import { tmdb } from "../utils/tmdb";

export interface PersonResult {
  adult?: boolean;
  gender?: number;
  id?: number;
  known_for?: [];
  known_for_department?: string;
  media_type: "person";
  name?: string;
  popularity?: number;
  profile_path?: string;
}

interface SearchMultiResponse {
  results: Array<MovieResult | TvResult | PersonResult | IUser>;
  total_results: number;
  total_pages: number;
}

const isUser = (
  result: MovieResult | TvResult | PersonResult | IUser
): result is IUser => {
  return (result as IUser)["username"] !== undefined //TODO: DOES NOT WORK ANYMORE FOR SOME REASON
};

const URL = `https://api.themoviedb.org/3/search/multi?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=`;

const search = ({ results, response }: { results: SearchMultiResponse; response: any }) => {

  const router = useRouter();
  const { query, page } = router.query;

  const matches = useMediaQuery("(max-width: 400px)", false);

  const [activePage, setPage] = useState(page ? parseInt(String(page)) : 1);

  const { data, error } = useSWR<SearchMultiResponse>(
    `${URL}${query}&page=${activePage === 1 ? 2 : activePage}`, //fetch the 2nd page before you switch
    fetcher
  );

  console.log(results)

  const [scroll, scrollTo] = useWindowScroll();

  return (
    <Container size="xl" py={36}>
      <Head>
        <title>"{query}" - Search</title>
      </Head>
      <h2 className="text-xl mb-6">
        Found {results.total_results} {results.total_results > 1 ? 'results' : 'result'} for "{query}"
      </h2>

      {results.total_pages > 1 &&
        <Center className="my-6">
          <Pagination
            classNames={{
              item: matches ? "px-1 h-7 w-7 min-w-[unset]" : "",
              active: "bg-primary",
            }}
            total={results.total_pages}
            page={activePage}
            onChange={(page) => {
              {
                setPage(page);
              }
            }}
          />
        </Center>
      }
      <div className="flex flex-col space-y-4">
        {activePage === 1
          ? results.results?.map((result) => {
            if (!isUser(result)) {
              if (result.media_type === "person") {
                return <Person key={result.id} result={result} />;
              } else if (result.media_type === "movie" || result.media_type === "tv") {
                return <Show key={result.id} result={result} />;
              }
            }
            else {
              result = result as IUser;
              return <User key={result.username} data={result} />
            }
          })
          : !data && !error
            ? [...Array(20)].map(() => (
              <Skeleton height={152} className="rounded-md w-full" />
            ))
            : data?.results?.map((result) => {
              if (!isUser(result)) {
                if (result.media_type === "person") {
                  return <Person key={result.id} result={result} />;
                } else if (result.media_type === "movie" || result.media_type === "tv") {
                  return <Show key={result.id} result={result} />;
                }
              }
              else {
                result = result as IUser;
                return <User key={result.username} data={result} />
              }
            })}
      </div>

      {results.total_pages > 1 &&
        <Center className="mt-6">
          <Pagination
            classNames={{
              item: matches ? "px-1 h-7 w-7 min-w-[unset]" : "",
              active: "bg-primary",
            }}
            total={results.total_pages}
            page={activePage}
            onChange={(page) => {
              {
                setPage(page);
                scrollTo({ y: 0 })
              }
            }}
          />
        </Center>
      }
    </Container>
  );
};
export default search;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { query } = ctx.query;

  //const res = await fetch(URL + query);
  const atlasPlugin = require('mongoose-atlas-search');

  await dbConnect();

  atlasPlugin.initialize({
    model: UserModel,
    overwriteFind: true,
    searchKey: 'search',
    searchFunction: (query: any) => {
      return {
        "index": "username",
        "text": {
          "query": `${query}`,
          "path": {
            "wildcard": "*"
          }
        }
      }
    }

  });

  const usersResults = await UserModel.find({ search: String(query) });

  console.log(usersResults, 'search');

  const results = await tmdb.searchMulti({ query: String(query) });

  if (results.results) {
    if (results.results.length === 20) {

      results.results.pop();
    }
  }

  if (usersResults && results.total_results) {
    console.log('total results');
    results.total_results += usersResults.length;
  } else if (usersResults && !results.total_results) {
    results.total_results = usersResults.length;
  }

  results.results = JSON.parse(JSON.stringify(usersResults)).concat(results.results);

  return {
    props: {
      results,
    },
  };
};
