import { Container } from "@mantine/core";
import { GetStaticProps } from "next";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import SignupModal from "../components/Home/SignupModal";
import TrendingMovies from "../components/Home/TrendingMovies";
import TrendingShows from "../components/Home/TrendingShows";
import { MovieType, TVShowType } from "../constants/types";
import fetcher from "../helpers/fetcher";
import { tmdb } from "../utils/tmdb";

interface HomeProps {
  movies: MovieType[];
  shows: TVShowType[];
}

const Home = ({ movies, shows }: HomeProps) => {
  const { data: session } = useSession();

  const { data, error } = useSWR(
    session ? `/api/user/userExists?email=${session.user?.email}` : null,
    fetcher
  );

  return (
    <Container py={36}>
      {data && !data.userExists && (
        <div>{session && <SignupModal session={session} />}</div>
      )}
      <TrendingMovies movies={movies} />
      <br />
      <TrendingShows shows={shows} />
    </Container>
  );
};


export default Home;

export const getStaticProps: GetStaticProps = async () => {
  const { results: movies } = await tmdb.trending({
    media_type: "movie",
    time_window: "day",
  });
  const { results: shows } = await tmdb.trending({
    media_type: "tv",
    time_window: "day",
  });

  return {
    props: {
      movies,
      shows,
    },
    revalidate: 60 * 60 * 24, //24h
  };
};
