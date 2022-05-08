import { Button, Center, Container, Group, Skeleton } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { GetStaticPaths, GetStaticProps } from "next";
import { useState } from "react";
import useSWR from "swr";
import Show from "../components/Show";
import { TVShowType } from "../constants/types";
import fetcher from "../helpers/fetcher";
import { tmdb } from "../utils/tmdb";

const URL = `https://api.themoviedb.org/3/trending/tv/day?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`;

const ShowSection = ({
  page,
  fallback,
}: {
  page: number;
  fallback: TVShowType[];
}) => {
  console.log(page, "pagenum");
  const { data } = useSWR(`${URL}&page=${page}`, fetcher, {
    fallbackData: fallback,
  });
  if (!data) return <></>;
  return (
    <>
      {data.results.map((data: TVShowType) => (
        <Show key={data.id} data={data} />
      ))}
    </>
  );
};

const shows = ({ data }: { data: TVShowType[] }) => {
  const matches = useMediaQuery("(max-width: 400px)", false);
  const [page, setPage] = useState(1);

  const pages = [];
  for (let i = 1; i <= page; i++) {
    pages.push(<ShowSection key={i} page={i} fallback={data} />);
  }

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

  const data = await res.json();

  return {
    props: {
      data,
    },
    revalidate: 60 * 60 * 24,
  };
};
