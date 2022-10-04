import {
  Button,
  Container,
  Loader,
  RingProgress,
  Text,
} from "@mantine/core";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { ExternalLink } from "tabler-icons-react";
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
import { Genre, TVShowType, AggregateCredits } from "../../constants/types";
import Head from "next/head";
import ShowCredits from "../../components/ShowCredits";
import { traktShow } from "../../utils/trakt";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone' // dependent on utc plugin
import { NextLink } from "@mantine/next";
import Episode from "../../components/Show/Episode";
dayjs.extend(utc)
dayjs.extend(timezone)

type Airs = {
  day: string;
  time: string;
  timezone: string;
}

const Show = ({
  show,
  providers,
  airs
}: {
  show: TVShowType & { aggregate_credits: AggregateCredits };
  providers: any;
  airs: Airs
}) => {
  const router = useRouter();

  const slug = router.query.slug as string;

  const showId = slug.split("-")[0];

  const { data: session, status } = useSession();

  const { user, error: userError } = useUser({ session });

  useEffect(() => {
    console.log(show, "show");
  }, [show])

  const [providersList, setProvidersList] = useState<any>();

  const [nextAirDate, setNextAirDate] = useState<Date | undefined>(undefined);
  const [lastAirDate, setLastAirDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    const locale = window.navigator.language.split("-")[1]
    setProvidersList(providers.results[locale]);

    if (!show.next_episode_to_air) return;
    const sourceDate = show.next_episode_to_air.air_date + " " + airs.time
    dayjs.tz.setDefault(airs.timezone)

    // The same behavior with dayjs.tz("2014-06-01 12:00", "America/New_York")
    setNextAirDate(dayjs.tz(sourceDate).local().toDate());
  }, [show.next_episode_to_air])

  useEffect(() => {
    const locale = window.navigator.language.split("-")[1]
    setProvidersList(providers.results[locale]);

    if (!show.last_episode_to_air) return;
    const sourceDate = show.last_episode_to_air.air_date + " " + airs.time
    dayjs.tz.setDefault(airs.timezone)

    // The same behavior with dayjs.tz("2014-06-01 12:00", "America/New_York")
    setLastAirDate(dayjs.tz(sourceDate).local().toDate());
  }, [show.last_episode_to_air])

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

  if (!show) {
    return (
      <div>
        <Loader size="xl" className="w-full p-auto mt-10" variant="dots" />
      </div>
    );
  }

  const handleWatched = async () => {
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
    if (!onList.on.includes("favorites")) {
      await addToList("favorites", showId, type);
    } else if (onList.on.includes("favorites")) {
      await removeFromList("favorites", showId, type);
    }
    mutateOnList();
  };

  return (
    <div>
      <Head>
        <title>{show.name}</title>
      </Head>
      <div className="relative">
        <div className="absolute top-0 left-0 w-full h-full brightness-[0.25]">
          <img
            src={IMG_URL(show.backdrop_path)}
            className="w-full h-full object-cover"
          />
        </div>
        <Container
          size="xl"
          className="relative h-full sm:flex py-10 sm:py-20"
        >
          <div className="flex flex-col items-center justify-center">
            <Image
              height={450}
              width={300}
              layout="fixed"
              src={IMG_URL(show.poster_path)}
              className={`rounded-t-md ${!providersList?.link && "rounded-b-md"} flex-1 self-center place-self-center`}
              placeholder="blur"
              blurDataURL={`/_next/image?url=${IMG_URL(
                show.poster_path
              )}&w=16&q=1`}
            />
            {providersList?.link &&
              <div className="flex justify-center items-center py-4 bg-slate-800 w-[300px]">
                <Button className="bg-primary" rightIcon={<ExternalLink />}>
                  <a href={`https://www.themoviedb.org/tv/${showId}/watch`} target="_blank">Watch providers</a>
                </Button>
              </div>
            }

          </div>
          <div className="flex-1 flex flex-col mt-4 sm:mt-0 sm:max-w-2xl sm:ml-8">
            <div className="flex">
              <p className="text-3xl font-semibold">
                {show.name}{" "}
                <span className="text-2xl">
                  ({show.first_air_date.split("-")[0]}-{show.status === "Ended" && show.last_air_date && show.last_air_date.split("-")[0]})
                </span>
              </p>
            </div>

            <div className="">
              {show.genres.map((genre: Genre, i: number) => (
                <React.Fragment key={i}>
                  <NextLink href={`/shows?genres=${genre.name.split(" ")[0].toLowerCase()}`} className="hover:underline ">
                    {genre.name}
                  </NextLink>
                  {i < show.genres.length - 1 && ", "}
                </React.Fragment>
              ))}{" "}
              {show.episode_run_time.length > 0 &&
                <>&bull; {show.episode_run_time}m</>
              }
            </div>

            {nextAirDate && show.status !== "Ended" &&
              <div>Airs: <span>{dayjs(nextAirDate).format("dddd")}s at {dayjs(nextAirDate).format("HH:mm")}</span> </div>
            }

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
                    {Math.round(show.vote_average * 10)}%
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

            <div className="mt-4">
              <p><span className="font-medium">Seasons: </span>{show.number_of_seasons} &bull; <span className="font-medium">Episodes:</span> {show.number_of_episodes}</p>
            </div>

            {show.status !== "Ended" && show.last_episode_to_air &&
              <div>
                <p><span className="font-medium">Currently:</span> {show.last_episode_to_air.season_number}x{show.last_episode_to_air.episode_number}</p>
              </div>
            }

            {show.created_by && show.created_by.length > 0 &&
              <div className="mt-4">
                <p className="font-semibold">Created by: </p>
                <div className="">
                  {show.created_by.map((creator, i) => (
                    <span key={creator.credit_id}>{creator.name}{i < show.created_by.length - 1 && ", "}</span>
                  ))}
                </div>
              </div>
            }
          </div>
        </Container>
      </div>
      <Container size="xl" className="flex flex-col pb-6">

        <div className="flex flex-col sm:flex-row sm:space-x-4">
          {show.next_episode_to_air &&
            <Episode episode={show.next_episode_to_air} backdrop={show.backdrop_path} airDate={nextAirDate} title="Next Episode" />
          }
          {show.last_episode_to_air &&
            <Episode episode={show.last_episode_to_air} backdrop={show.backdrop_path} airDate={lastAirDate} title="Last Episode" />
          }
        </div>

        <div className="flex flex-col md:flex-row md:space-x-4 w-full ">
          <ShowCredits credits={show.aggregate_credits} />

          <div className="md:py-6 sm:mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Info</h2>
            <div>
              <h3 className="font-semibold">Status</h3>
              <p>{show.status}</p>
            </div>

            <div>
              <h3 className="font-semibold">Original Language</h3>
              <p>{new Intl.DisplayNames(['en'], {
                type: 'language'
              }).of(show.original_language)}</p>
            </div>

            <div>
              <h3 className="font-semibold">Networks</h3>
              <p className="flex flex-col space-y-2">{show.networks.map((network, i) => (
                <>{network.name}{i < show.networks.length - 1 && ", "}</>
              ))}</p>
            </div>
          </div>

        </div>
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
    append_to_response: "aggregate_credits", //TODO: Switch to aggregate_credits, have to make my own type
  });

  const showName = showData.name?.toLowerCase().replace(/[\W_]+/g, "-")

  if (!slug.split("-").slice(1).join("-")) {
    return {
      redirect: {
        destination: `/show/${showId}-${showName}`,
        permanent: true,
      },
    }
  }


  const providers = await tmdb.tvWatchProviders({ id: showId })

  const data = await traktShow({ slug: showName })


  return {
    props: {
      show: showData,
      providers,
      airs: data.airs
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