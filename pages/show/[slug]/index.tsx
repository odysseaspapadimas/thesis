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
import useSWR, { SWRConfig } from "swr";
import { ChevronRight, ExternalLink } from "tabler-icons-react";
import AlreadyWatched from "../../../components/List/AlreadyWatched";
import PlanToWatch from "../../../components/List/PlanToWatch";
import Favorite from "../../../components/List/Favorite";
import { IMG_URL } from "../../../constants/tmdbUrls";
import fetcher from "../../../helpers/fetcher";
import useUser from "../../../hooks/use-user";
import addToList from "../../../utils/addToList";
import removeFromList from "../../../utils/removeFromList";
import { GetStaticPaths, GetStaticProps } from "next";
import { tmdb } from "../../../utils/tmdb";
import { Genre, TVShowType, AggregateCredits, Airs } from "../../../constants/types";
import Head from "next/head";
import ShowCredits from "../../../components/ShowCredits";
import { traktShow } from "../../../utils/trakt";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone' // dependent on utc plugin
import { NextLink } from "@mantine/next";
import Episode from "../../../components/Show/Episode";
import Recommend from "../../../components/Recommend";
import { showNotification as _showNotification } from "@mantine/notifications";
import FriendActivity from "../../../components/FriendActivity";
import Rate from "../../../components/List/Rate";
import RatingRing from "../../../components/RatingRing";
import dbConnect from "../../../lib/dbConnect";
import Media from "../../../models/Media";
import Review from "../../../components/Review";
dayjs.extend(utc)
dayjs.extend(timezone)

const Show = ({
  show,
  providers,
  airs,
  media: mediaData,
  fallback
}: {
  show: TVShowType & { aggregate_credits: AggregateCredits };
  providers: any;
  airs: Airs;
  media: any;
  fallback: any
}) => {
  const router = useRouter();

  const slug = router.query.slug as string;

  const showId = slug.split("-")[0];

  const { data: session, status } = useSession();

  const { user, error: userError } = useUser({ session });

  const { data: media } = useSWR(`/api/user/review?id=${show.id}&type=show`, fetcher)

  const lastSeason = show.seasons[show.seasons.length - 1];

  useEffect(() => {
    console.log(show, airs, "show");
  }, [show])

  const [providersList, setProvidersList] = useState<any>();

  const [nextAirDate, setNextAirDate] = useState<Date | undefined>(undefined);
  const [lastAirDate, setLastAirDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    const locale = window.navigator.language.split("-")[1]
    setProvidersList(providers.results[locale]);

    if (!airs) return;

    if (!show.next_episode_to_air || !airs.time) return;
    const sourceDate = show.next_episode_to_air.air_date + " " + airs.time
    dayjs.tz.setDefault(airs.timezone)

    // The same behavior with dayjs.tz("2014-06-01 12:00", "America/New_York")
    setNextAirDate(dayjs.tz(sourceDate).local().toDate());
  }, [show.next_episode_to_air, airs])

  useEffect(() => {
    const locale = window.navigator.language.split("-")[1]
    setProvidersList(providers.results[locale]);

    if (!airs) return;

    if (!show.last_episode_to_air || !airs.time) return;
    const sourceDate = show.last_episode_to_air.air_date + " " + airs.time
    dayjs.tz.setDefault(airs.timezone)

    // The same behavior with dayjs.tz("2014-06-01 12:00", "America/New_York")
    setLastAirDate(dayjs.tz(sourceDate).local().toDate());
  }, [show.last_episode_to_air, airs])

  const type = "show"; //What kind of media is this to make seperate calls when adding/removing from lists

  const {
    data: onList,
    error: onListError,
    mutate: mutateOnList,
  } = useSWR(
    user
      ? `/api/user/list/onList?username=${user.username}&id=${showId}&type=${type}`
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
      await addToList("watched", String(show.id), type);

      showNotification({
        title: "Added to Already Watched list",
        msg: `'${show.name}' was successfully added to your list`,
        list: "watched"
      });

      if (onList.on.includes("plan")) {
        await removeFromList("plan", String(show.id), type);
        showNotification({
          title: "Removed from Plan to Watch list",
          msg: `'${show.name}' was successfully removed from your list`,
          list: "plan"
        });
      }
    } else if (onList.on.includes("watched")) {
      await removeFromList("watched", String(show.id), type);
      showNotification({
        title: "Removed from Already Watched list",
        msg: `'${show.name}' was successfully removed from your list`,
        list: "plan"
      });
    }

    mutateOnList();
  };

  const handlePlan = async () => {
    if (!onList.on.includes("plan")) {
      await addToList("plan", String(show.id), type);

      showNotification({
        title: "Added to Plan to Watch list",
        msg: `'${show.name}' was successfully added to your list`,
        list: "plan"
      });

      if (onList.on.includes("watched")) {
        await removeFromList("watched", String(show.id), type);
        showNotification({
          title: "Removed from Already Watched list",
          msg: `'${show.name}' was successfully removed from your list`,
          list: "watched"
        });
      }
    } else if (onList.on.includes("plan")) {
      await removeFromList("plan", String(show.id), type);
      showNotification({
        title: "Removed from Plan to Watch list",
        msg: `'${show.name}' was successfully removed from your list`,
        list: "plan"
      });
    }
    mutateOnList();
  };

  const handleFavorite = async () => {
    if (!onList.on.includes("favorites")) {
      await addToList("favorites", String(show.id), type);
      showNotification({
        title: "Added to Favorites list",
        msg: `'${show.name}' was successfully added to your list`,
        list: "favorites"
      });
    } else if (onList.on.includes("favorites")) {
      await removeFromList("favorites", String(show.id), type);
      showNotification({
        title: "Removed from Favorites list",
        msg: `'${show.name}' was successfully removed from your list`,
        list: "favorites"
      });
    }
    mutateOnList();
  };


  return (
    <SWRConfig value={{ fallback }}>
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

              {session &&
                <FriendActivity type={type} id={showId} />
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
                <RatingRing vote_average={show.vote_average} vote_count={show.vote_count} media={mediaData} />

                {user && (
                  <div className="flex flex-col space-y-4 sm:ml-8">
                    <div className="flex justify-around items-center space-x-8">
                      <AlreadyWatched onList={onList} handler={handleWatched} />
                      <PlanToWatch onList={onList} handler={handlePlan} />
                      <Favorite onList={onList} handler={handleFavorite} />
                      <Rate id={showId} type={type} onList={onList} ratings={user.ratings} username={user.username} image_url={user.image_url} mutate={mutateOnList} />
                    </div>
                    <Recommend user={user.username} users={user.messages} show={show} />

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
        <Container className="flex flex-col pb-6">

          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:space-x-4 pt-6">
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
                  <span key={network.id}>{network.name}{i < show.networks.length - 1 && ", "}</span>
                ))}</p>
              </div>
            </div>

          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Last Season</h2>
            <div className="flex items-center space-x-4">
              <NextLink href={`/show/${router.query.slug}/season/${lastSeason.season_number}`}>
                <div style={{ width: 150, height: 225 }}>
                  {lastSeason.poster_path ?
                    <Image src={IMG_URL(lastSeason.poster_path)} width={150} height={225} layout="fixed" className="rounded-l-md" />
                    : <div className="w-[150px] h-[225px] bg-dark"></div>
                  }
                </div>
              </NextLink>
              <div>
                <div>
                  <NextLink href={`/show/${router.query.slug}/season/${lastSeason.season_number}`}>
                    <h3 className="text-xl font-semibold hover:text-gray-300">{lastSeason.name}</h3>
                  </NextLink>
                  <span className="font-medium">{lastSeason?.air_date?.split("-")[0]} | {lastSeason.episode_count} Episodes</span>
                </div>
                <div className="mt-4">
                  {lastSeason.overview.split("\n").map((text, i) => (
                    <p key={i} className="mb-2">{text}</p>
                  ))}
                </div>
              </div>
            </div>

            <NextLink href={`/show/${router.query.slug}/seasons`}>
              <h3 className="text-lg font-semibold hover:text-gray-300 mt-2">View All Seasons</h3>
            </NextLink>
          </div>

          <div>
            <h2 className="text-2xl font-semibold my-4">Reviews</h2>

            <div className="flex flex-col space-y-4">
              {media?.ratings && media.ratings.length > 0 && media.ratings.some((rating: any) => rating.review) ? media.ratings.map((rating: any) => (
                rating.review &&
                <Review key={rating.username} rating={rating} />
              )) : (
                <p>No reviews yet...</p>
              )}

            </div>
          </div>
        </Container>
      </div>
    </SWRConfig>
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

  await dbConnect()
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

  return {
    props: {
      show: showData,
      providers,
      airs: data?.airs ?? null,
      media: JSON.parse(JSON.stringify({
        ratings: media?.ratings,
        vote_average: media_vote_average,
        vote_count: media?.ratings.length ?? 0,
      })),
      fallback: {
        [`/api/user/review?id=${showId}&type=show`]: JSON.parse(JSON.stringify(media))
      }
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