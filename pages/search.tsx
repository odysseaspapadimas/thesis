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
import { useEffect, useState } from "react";
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

const search = () => {

  const router = useRouter();
  const { q: query, page } = router.query;

  console.log(query, 'query');

  const matches = useMediaQuery("(max-width: 400px)", false);

  const { data: firstPage } = useSWR<SearchMultiResponse>(`/api/search?q=${encodeURIComponent(query as string)}&page=1`, fetcher);


  const [activePage, setPage] = useState(page ? parseInt(String(page)) : 1);

  useEffect(() => {
    if (!page) return;
    setPage(Number(page))
  }, [page])

  useEffect(() => {
    if (!page || !firstPage || !firstPage.total_pages) return;

    if (Number(page) > firstPage.total_pages) {
      console.log('run')
      setPage(1);
    } else {
      setPage(Number(page));
      console.log(page, 'run3')
    }
  }, [page, firstPage])

  useEffect(() => {
    if (!query || !firstPage || !firstPage.total_pages) return;
    if(activePage > firstPage.total_pages) return;
    router.push(`/search?q=${encodeURIComponent(query as string)}&page=${activePage}`);
  }, [activePage, query, firstPage])


  const { data, error } = useSWR<SearchMultiResponse>(`/api/search?q=${query}&page=${activePage}`, fetcher);

  const [scroll, scrollTo] = useWindowScroll();

  if (!query) return <Container py={36}>
    <h2>Try searching for something!</h2>
  </Container>

  if (!firstPage) return <Container py={36}>
    <Center>
      <Loader />
    </Center>
  </Container>

  return (
    <Container py={36}>
      <Head>
        <title>"{query}" - Search</title>
      </Head>
      <h2 className="text-xl mb-6">
        Found {firstPage.total_results} {firstPage.total_results > 1 ? 'results' : 'result'} for "{query}"
      </h2>

      {firstPage.total_pages > 1 &&
        <Center className="my-6">
          <Pagination
            classNames={{
              item: matches ? "px-1 h-7 w-7 min-w-[unset]" : "",
            }}
            total={firstPage.total_pages}
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
        {!data && !error
          ? [...Array(20)].map((_, i) => (
            <Skeleton key={i} height={152} className="rounded-md w-full" />
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

      {firstPage.total_pages > 1 &&
        <Center className="mt-6">
          <Pagination
            classNames={{
              item: matches ? "px-1 h-7 w-7 min-w-[unset]" : "",
            }}
            total={firstPage.total_pages}
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

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//   const { query } = ctx.query;

//   //const res = await fetch(URL + query);
//   const atlasPlugin = require('mongoose-atlas-search');

//   await dbConnect();

//   atlasPlugin.initialize({
//     model: UserModel,
//     overwriteFind: true,
//     searchKey: 'search',
//     searchFunction: (query: any) => {
//       return {
//         "index": "username",
//         "text": {
//           "query": `${query}`,
//           "path": {
//             "wildcard": "*"
//           }
//         }
//       }
//     }

//   });

//   const usersResults = await UserModel.find({ search: String(query) });

//   console.log(usersResults, 'search');

//   const results = await tmdb.searchMulti({ query: String(query) });

//   if (results.results) {
//     if (results.results.length === 20) {

//       results.results.pop();
//     }
//   }

//   if (usersResults && results.total_results) {
//     console.log('total results');
//     results.total_results += usersResults.length;
//   } else if (usersResults && !results.total_results) {
//     results.total_results = usersResults.length;
//   }

//   results.results = JSON.parse(JSON.stringify(usersResults)).concat(results.results);

//   return {
//     props: {
//       results,
//     },
//   };
// };
