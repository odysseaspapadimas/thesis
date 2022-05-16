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
import React, { useEffect } from "react";
import useSWR from "swr";
import { Eye, Heart, Plus } from "tabler-icons-react";
import Header from "../../components/Header";
import AlreadyWatched from "../../components/List/AlreadyWatched";
import PlanToWatch from "../../components/List/PlanToWatch";
import Favorite from "../../components/List/Favorite";
import { IMG_URL, MOVIE_URL } from "../../constants/tmdbUrls";
import fetcher from "../../helpers/fetcher";
import useUser from "../../hooks/use-user";
import addToList from "../../utils/addToList";
import removeFromList from "../../utils/removeFromList";
import { GetStaticPaths, GetStaticProps } from "next";
import { tmdb } from "../../utils/tmdb";
import { List, ListTypes } from "../api/user/list/onList";
import { Genre, TVShowType } from "../../constants/types";
import { CreditsResponse } from "moviedb-promise/dist/request-types";
import Credits from "../../components/Credits";

const Show = ({
  show,
}: {
  show: TVShowType & { credits: CreditsResponse };
}) => {
  const router = useRouter();

  const slug = router.query.slug as string;

  const showId = slug.split("-")[0];

  const { data: session, status } = useSession();

  const { user, error: userError } = useUser({ session });
  console.log(show, "show");

  const type = "show"; //What kind of media is this to make seperate calls when adding/removing from lists

  const {
    data: onList,
    error: onListError,
    mutate: mutateOnList,
  } = useSWR(
    user
      ? `/api/user/list/onList?username=${user.username}&id=${showId}`
      : null,
    fetcher
  );

  useEffect(() => {
    //console.log(router);
    console.log(onList, "onList");
  }, [onList]);

  if (!show) {
    return (
      <div>
        <Loader size="xl" className="w-full p-auto mt-10" variant="dots" />
      </div>
    );
  }

  const handleWatched = async () => {
    console.log("hi");
    if (!onList.on.includes("watched")) {
      await addToList("watched", showId, type);

      if (onList.on.includes("plan")) {
        await removeFromList("plan", showId, type);
      }
    } else if (onList.on.includes("watched")) {
      await removeFromList("watched", showId, type);
    }

    mutateOnList();
  };

  const handlePlan = async () => {
    if (!onList.on.includes("plan")) {
      await addToList("plan", showId, type);

      if (onList.on.includes("watched")) {
        await removeFromList("watched", showId, type);
      }
    } else if (onList.on.includes("plan")) {
      await removeFromList("plan", showId, type);
    }
    mutateOnList();
  };

  const handleFavorite = async () => {
    console.log("hi");
    if (!onList.on.includes("favorites")) {
      await addToList("favorites", showId, type);
    } else if (onList.on.includes("favorites")) {
      await removeFromList("favorites", showId, type);
    }
    mutateOnList();
  };

  return (
    <div>
      <div className="relative">
        <div className="absolute top-0 left-0 w-full h-full brightness-[0.25]">
          <img
            src={IMG_URL(show.backdrop_path)}
            className="w-full h-full object-cover"
          />
        </div>
        <Container
          size="xl"
          className="relative h-full grid place-items-center sm:flex sm:items-center py-10 sm:py-20"
        >
          <Image
            height={450}
            width={300}
            src={IMG_URL(show.poster_path)}
            className="rounded-md flex-1"
            placeholder="blur"
            blurDataURL={`/_next/image?url=${IMG_URL(
              show.poster_path
            )}&w=16&q=1`}
          />

          <div className="flex-1 flex flex-col mt-8 sm:max-w-2xl sm:ml-8">
            <div className="flex">
              <p className="text-3xl font-semibold">
                {show.name}
                <span className="text-2xl">
                  &nbsp;({show.first_air_date.split("-")[0]})
                </span>
              </p>
            </div>

            <div className="flex space-x-2">
              {show.genres.map((genre: Genre, i: number) => (
                <React.Fragment key={i}>
                  {genre.name}
                  {i < show.genres.length - 1 && ", "}
                </React.Fragment>
              ))}{" "}
              &bull; {show.episode_run_time}m
            </div>

            <div className="flex items-center flex-col sm:flex-row sm:py-4">
              <RingProgress
                sections={[
                  {
                    value: show.vote_average * 10,
                    color: `hsl(${(115 * show.vote_average) / 10}, 100%, 28%)`,
                  },
                ]}
                size={100}
                roundCaps
                className="rounded-full bg-black bg-opacity-50 my-4 sm:my-0"
                label={
                  <Text color="white" weight={700} align="center" size="lg">
                    {show.vote_average * 10}%
                  </Text>
                }
              />

              {user && (
                <div className="flex justify-around items-center sm:ml-8 space-x-8">
                  <AlreadyWatched onList={onList} handler={handleWatched} />
                  <PlanToWatch onList={onList} handler={handlePlan} />
                  <Favorite onList={onList} handler={handleFavorite} />
                </div>
              )}
            </div>

            <div>
              <p className="text-2xl font-medium my-2">Overview</p>
              <Text>
                {show.overview
                  ? show.overview
                  : "There's no available overview."}
              </Text>
            </div>
          </div>
        </Container>
      </div>
      <Container size="xl">
        <Credits credits={show.credits} />
      </Container>
    </div>
  );
};

export default Show;

export const getStaticProps: GetStaticProps = async (ctx) => {
  const slug = ctx.params?.slug as string;

  const showId = slug.split("-")[0];

  const showData = await tmdb.tvInfo({
    id: showId,
    append_to_response: "credits", //TODO: Switch to aggregate_credits, have to make my own type
  });

  console.log(showData, "showdata");

  console.log("static showid", showId);

  return {
    props: {
      show: showData,
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
