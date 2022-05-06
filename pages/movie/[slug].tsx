import {
  ActionIcon,
  Button,
  Container,
  Loader,
  Overlay,
  RingProgress,
  Text,
  Tooltip,
} from "@mantine/core";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useSWR from "swr";
import { Eye, Heart, Plus } from "tabler-icons-react";
import Header from "../../components/Header";
import {
  Genre,
  Movie as MovieProps,
} from "../../components/Home/TrendingMovies";
import AlreadyWatched from "../../components/List/AlreadyWatched";
import PlanToWatch from "../../components/List/PlanToWatch";
import Favorite from "../../components/List/Favorite";
import { IMG_URL, MOVIE_URL } from "../../constants/tmdbUrls";
import fetcher from "../../helpers/fetcher";
import useUser from "../../hooks/use-user";
import addToList from "../../lib/addToList";
import removeFromList from "../../lib/removeFromList";
import { GetStaticPaths, GetStaticProps } from "next";
import { tmdb } from "../../utils/tmdb";
import { List, ListTypes } from "../api/user/list/onList";

const Movie = ({ movie }: { movie: any }) => {
  const router = useRouter();

  const slug = router.query.slug as string;

  const movieId = slug.split("-")[0];

  const { data: session, status } = useSession();

  const { user, error: userError } = useUser({ session });

  const {
    data: onList,
    error: onListError,
    mutate: mutateOnList,
  } = useSWR(
    user
      ? `/api/user/list/onList?username=${user.username}&id=${movieId}`
      : null,
    fetcher
  );

  useEffect(() => {
    //console.log(router);
    console.log(onList, "onList");
  }, [onList]);

  if (!movie) {
    return (
      <div>
        <Loader size="xl" className="w-full p-auto mt-10" variant="dots" />
      </div>
    );
  }

  const handleWatched = async () => {
    if (!onList.on.includes("watched")) {
      await addToList("watched", movieId);

      if (onList.on.includes("plan")) {
        await removeFromList("plan", movieId);
      }
    } else if (onList.on.includes("watched")) {
      await removeFromList("watched", movieId);
    }

    mutateOnList();
  };

  const handlePlan = async () => {
    if (!onList.on.includes("plan")) {
      await addToList("plan", movieId);

      if (onList.on.includes("watched")) {
        await removeFromList("watched", movieId);
      }
    } else if (onList.on.includes("plan")) {
      await removeFromList("plan", movieId);
    }
    mutateOnList();
  };

  const handleFavorite = async () => {
    console.log("hi");
    if (!onList.on.includes("favorite")) {
      await addToList("favorite", movieId);
    } else if (onList.on.includes("favorite")) {
      await removeFromList("favorite", movieId);
    }
    mutateOnList();
  };

  return (
    <div>
      <div className="relative">
        <div className="absolute top-0 left-0 w-full h-full brightness-[0.25]">
          <img
            src={IMG_URL(movie.backdrop_path)}
            className="w-full h-full object-cover"
          />
        </div>
        <Container
          size="xl"
          className="relative h-full md:flex items-center py-20"
        >
          <Image
            height={450}
            width={300}
            src={IMG_URL(movie.poster_path)}
            className="rounded-md flex-1"
          />

          <div className="flex-1 max-w-2xl flex flex-col px-8">
            <div className="flex items-end">
              <p className="text-3xl font-semibold">
                {movie.title}
                <span className="text-2xl">
                  &nbsp;({movie.release_date.split("-")[0]})
                </span>
              </p>
            </div>

            <div className="flex space-x-2">
              <p>{movie.release_date}</p>
              &nbsp; &bull;
              {movie.genres.map((genre: Genre, i: number) => (
                <p key={genre.id}>
                  {genre.name}
                  {i < movie.genres.length - 1 && ","}
                </p>
              ))}
              &nbsp; &bull;
              <p>{movie.runtime}m</p>
            </div>

            <div className="flex items-center">
              <RingProgress
                sections={[
                  {
                    value: movie.vote_average * 10,
                    color: `hsl(${(115 * movie.vote_average) / 10}, 100%, 28%)`,
                  },
                ]}
                size={100}
                roundCaps
                className="rounded-full bg-black bg-opacity-50"
                label={
                  <Text color="blue" weight={700} align="center" size="lg">
                    {movie.vote_average * 10}%
                  </Text>
                }
              />

              {user && (
                <div className="flex justify-around items-center ml-8 space-x-8">
                  <AlreadyWatched onList={onList} handler={handleWatched} />
                  <PlanToWatch onList={onList} handler={handlePlan} />
                  <Favorite onList={onList} handler={handleFavorite} />
                </div>
              )}
            </div>

            <div>
              <Text size="xl" weight={500} my={8}>
                Overview
              </Text>
              <Text>
                {movie.overview
                  ? movie.overview
                  : "There's no available overview."}
              </Text>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Movie;

export const getStaticProps: GetStaticProps = async (ctx) => {
  const slug = ctx.params?.slug as string;

  const movieId = slug.split("-")[0];

  const movieData = await tmdb.movieInfo(movieId);

  console.log("static movieid", movieId);

  return {
    props: {
      movie: movieData,
    },
    revalidate: 60 * 60 * 24, //Once a day
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};
