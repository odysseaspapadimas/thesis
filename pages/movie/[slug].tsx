import { Container, Loader, RingProgress, Text } from "@mantine/core";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import useSWR from "swr";
import AlreadyWatched from "../../components/List/AlreadyWatched";
import PlanToWatch from "../../components/List/PlanToWatch";
import Favorite from "../../components/List/Favorite";
import { IMG_URL } from "../../constants/tmdbUrls";
import fetcher from "../../helpers/fetcher";
import useUser from "../../hooks/use-user";
import addToList from "../../utils/addToList";
import removeFromList from "../../utils/removeFromList";
import { GetStaticPaths, GetStaticProps } from "next";
import { tmdb } from "../../utils/tmdb";
import { Genre, MovieType } from "../../constants/types";
import { CreditsResponse } from "moviedb-promise";
import Credits from "../../components/Credits";
import Head from "next/head";
import { NextLink } from "@mantine/next";
import Recommend from "../../components/Recommend";
import { showNotification as _showNotification } from "@mantine/notifications";
import FriendActivity from "../../components/FriendActivity";
import { ChevronRight } from "tabler-icons-react";

const Movie = ({
  movie,
}: {
  movie: MovieType & { credits: CreditsResponse };
}) => {
  const router = useRouter();

  const slug = router.query.slug as string;

  const movieId = slug.split("-")[0];

  const { data: session, status } = useSession();

  const { user, error: userError } = useUser({ session });

  const type = "movie"; //What kind of media is this to make seperate calls when adding/removing from lists

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

  const showNotification = ({ title, msg, list }: { title: string, msg: string, list: "watched" | "plan" | "favorites" }) => {
    _showNotification({
      title,
      message: <div>
        <div>{msg}</div>
        <div className="absolute right-3 top-1/2 -translate-y-1/2"><ChevronRight /></div>
      </div>,
      onClick: () => router.push(`/u/${user.username}?list=${list}`),
      classNames: { body: "cursor-pointer" },
      disallowClose: true,
    })
  }

   const handleWatched = async () => {
    if (!onList.on.includes("watched")) {
      await addToList("watched", movieId, type);

      showNotification({
        title: "Added to Already Watched list",
        msg: `'${movie.title}' was successfully added to your list`,
        list: "watched"
      });

      if (onList.on.includes("plan")) {
        await removeFromList("plan", movieId, type);
        showNotification({
          title: "Removed from Plan to Watch list",
          msg: `'${movie.title}' was successfully removed from your list`,
          list: "plan"
        });
      }
    } else if (onList.on.includes("watched")) {
      await removeFromList("watched", movieId, type);
      showNotification({
        title: "Removed from Already Watched list",
        msg: `'${movie.title}' was successfully removed from your list`,
        list: "plan"
      });
    }

    mutateOnList();
  };

  const handlePlan = async () => {
    if (!onList.on.includes("plan")) {
      await addToList("plan", movieId, type);

      showNotification({
        title: "Added to Plan to Watch list",
        msg: `'${movie.title}' was successfully added to your list`,
        list: "plan"
      });

      if (onList.on.includes("watched")) {
        await removeFromList("watched", movieId, type);
        showNotification({
          title: "Removed from Already Watched list",
          msg: `'${movie.title}' was successfully removed from your list`,
          list: "watched"
        });
      }
    } else if (onList.on.includes("plan")) {
      await removeFromList("plan", movieId, type);
      showNotification({
        title: "Removed from Plan to Watch list",
        msg: `'${movie.title}' was successfully removed from your list`,
        list: "plan"
      });
    }
    mutateOnList();
  };

  const handleFavorite = async () => {
    console.log("hi");
    if (!onList.on.includes("favorites")) {
      await addToList("favorites", movieId, type);
      showNotification({
        title: "Added to Favorites list",
        msg: `'${movie.title}' was successfully added to your list`,
        list: "favorites"
      });
    } else if (onList.on.includes("favorites")) {
      await removeFromList("favorites", movieId, type);
      showNotification({
        title: "Removed from Favorites list",
        msg: `'${movie.title}' was successfully removed from your list`,
        list: "favorites"
      });
    }
    mutateOnList();
  };

  return (
    <div>
      <Head>
        <title>{movie.title}</title>
      </Head>
      <div className="relative">
        <div className="absolute top-0 left-0 w-full h-full brightness-[0.25]">
          <img
            src={IMG_URL(movie.backdrop_path)}
            className="w-full h-full object-cover"
          />
        </div>
        <Container
          size="xl"
          className="relative h-full grid place-items-center sm:flex sm:items-center py-10 sm:py-20"
        >

          <div className="flex flex-col items-center justify-center">
            <Image
              height={450}
              width={300}
              src={IMG_URL(movie.poster_path)}
              className="rounded-md flex-1"
              placeholder="blur"
              blurDataURL={`/_next/image?url=${IMG_URL(
                movie.poster_path
              )}&w=16&q=1`}
            />


            {session &&
              <FriendActivity type={type} id={movieId} />
            }
          </div>

          <div className="flex-1 flex flex-col mt-8 sm:max-w-2xl sm:ml-8">
            <div className="flex">
              <p className="text-3xl font-semibold">
                {movie.title}
                <span className="text-2xl">
                  {" "}
                  ({movie.release_date.split("-")[0]})
                </span>
              </p>
            </div>

            <div className="flex space-x-2">
              {movie.release_date} &bull;{" "}
              {movie.genres.map((genre: Genre, i: number) => (
                <React.Fragment key={i}>
                  <NextLink href={`/movies?genres=${genre.name.split(" ")[0].toLowerCase()}`} className="hover:underline">
                    {genre.name}
                  </NextLink>
                  {i < movie.genres.length - 1 && ", "}
                </React.Fragment>
              ))}{" "}
              &bull; {movie.runtime}m
            </div>

            <div className="flex items-center flex-col sm:flex-row sm:my-4">
              <RingProgress
                sections={[
                  {
                    value: movie.vote_average * 10,
                    color: `hsl(${(115 * movie.vote_average) / 10}, 100%, 28%)`,
                  },
                ]}
                size={100}
                roundCaps
                className="rounded-full bg-black bg-opacity-50 my-4 sm:my-0"
                label={
                  <Text color="white" weight={700} align="center" size="lg">
                    {Math.round(movie.vote_average * 10)}%
                  </Text>
                }
              />

              {user && (
                <div className="flex flex-col space-y-4 sm:ml-8">
                  <div className="flex justify-around items-center space-x-8">
                    <AlreadyWatched onList={onList} handler={handleWatched} />
                    <PlanToWatch onList={onList} handler={handlePlan} />
                    <Favorite onList={onList} handler={handleFavorite} />
                  </div>
                  <Recommend user={user.username} users={user.messages} movie={movie} />
                </div>
              )}
            </div>

            <div>
              <p className="text-2xl font-medium my-2">Overview</p>
              <Text>
                {movie.overview
                  ? movie.overview
                  : "There's no available overview."}
              </Text>
            </div>
          </div>
        </Container>
      </div>

      <Container size="xl">
        <Credits credits={movie.credits} />
      </Container>
    </div>
  );
};

export default Movie;

export const getStaticProps: GetStaticProps = async (ctx) => {
  const slug = ctx.params?.slug as string;

  const movieId = slug.split("-")[0];

  const movieData = await tmdb.movieInfo({
    id: movieId,
    append_to_response: "credits",
  });

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
