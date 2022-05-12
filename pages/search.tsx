import { Button, Center, Container, Pagination } from "@mantine/core";
import { NextLink } from "@mantine/next";
import { MovieResult, TvResult } from "moviedb-promise/dist/request-types";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import Person from "../components/Search/Results/Person";
import Show from "../components/Search/Results/Show";
import { Type } from "../utils/addToList";
import { tmdb } from "../utils/tmdb";

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

const search = ({ data }: { data: SearchMultiResponse }) => {
  const router = useRouter();
  const { query } = router.query;

  const [activePage, setPage] = useState(1);

  return (
    <Container size="xl" py={48}>
      <h2 className="text-xl mb-6">
        Found {data.total_results} results for "{query}"
      </h2>
      <div className="flex flex-col space-y-4">
        {data.results?.map((result) => {
          if (result.media_type === "person") {
            console.log(result);
            return <Person key={result.id} result={result} />;
          } else {
            return <Show key={result.id} result={result} />;
          }
        })}
      </div>

      <Center className="mt-12">
        <Pagination
          classNames={{
            active: "bg-primary",
          }}
          total={data.total_pages}
          page={activePage}
          onChange={setPage}
        />
      </Center>
    </Container>
  );
};
export default search;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { query } = ctx.query;

  const URL = `https://api.themoviedb.org/3/search/multi?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=`;

  const res = await fetch(URL + query);

  const data = await res.json();

  return {
    props: {
      data,
    },
  };
};
