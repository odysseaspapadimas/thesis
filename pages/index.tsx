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
import dbConnect from "../lib/dbConnect";
import Media from "../models/Media";
import { MovieResult, TvResult } from "moviedb-promise";

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
  const trendingMovies = await tmdb.trending({
    media_type: "movie",
    time_window: "day",
  });

  const movies = trendingMovies.results as MovieResult[]

  const trendingShows = await tmdb.trending({
    media_type: "tv",
    time_window: "day",
  });
  const shows = trendingShows.results as TvResult[]

  await dbConnect()

  if (movies) {
    for (let i = 0; i < movies.length; i++) {
      const movieId = movies[i].id;
      const movieData = movies[i];
      const media = await Media.findOne({ id: movieId, type: "movie" })

      let media_vote_average = 0 as number | null;

      if (media && media.ratings.length > 0 && media_vote_average === 0) {
        for (let i = 0; i < media.ratings.length; i++) {
          media_vote_average += media.ratings[i].rating
        }

        media_vote_average = media_vote_average / media.ratings.length;
      } else {
        media_vote_average = null;
      }



      if (movieData.vote_average && movieData.vote_count && media_vote_average) {
        movieData.vote_average = (((movieData.vote_average * movieData.vote_count) + (media_vote_average * 2)) / (media.ratings.length + movieData.vote_count))
      } else if (media_vote_average) {
        movieData.vote_average = media_vote_average * 2;
      }

      movies[i] = movieData;
    }
  }

  if (shows) {

    for (let i = 0; i < shows.length; i++) {
      const showId = shows[i].id;
      const showData = shows[i];
      const media = await Media.findOne({ id: showId, type: "show" })

      let media_vote_average = 0 as number | null;

      if (media && media.ratings.length > 0 && media_vote_average === 0) {
        for (let i = 0; i < media.ratings.length; i++) {
          media_vote_average += media.ratings[i].rating
        }

        media_vote_average = media_vote_average / media.ratings.length;
      } else {
        media_vote_average = null;
      }

      if (showData.vote_average && showData.vote_count && media_vote_average) {
        showData.vote_average = (((showData.vote_average * showData.vote_count) + (media_vote_average * 2)) / (media.ratings.length + showData.vote_count))
      } else if (media_vote_average) {
        showData.vote_average = media_vote_average * 2;
      }

      shows[i] = showData;
    }

  }


  return {
    props: {
      movies,
      shows,
    },
    revalidate: 60 * 60 * 24, //24h
  };
};
