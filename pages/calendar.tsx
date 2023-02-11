import { Indicator, Tooltip, HoverCard, Text, LoadingOverlay, Container } from '@mantine/core';
import { CalendarBase } from '@mantine/dates';
import { ShowResponse } from 'moviedb-promise';
import React, { useEffect, useState } from 'react'
import useSWR from 'swr';
import fetcher from '../helpers/fetcher';
import { traktShow, traktWeek } from '../utils/trakt';
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone' // dependent on utc plugin
import { NextPageWithAuth } from './_app';
import Calendar from '../components/Calendar';
import { TVShowType } from '../constants/types';
import shows from './shows';
dayjs.extend(utc)
dayjs.extend(timezone)

export type AiringShow = {
  name: string | undefined;
  date: Date;
  id: number | undefined;
  poster_path: string;
  season: number | undefined
  episode: number | undefined
}

const CalendarPage: NextPageWithAuth = () => {
  const { data, error } = useSWR<TVShowType[]>(
    "/api/user/calendar",
    fetcher
  );

  const [showsList, setShowsList] = useState<AiringShow[]>([]);

  const [loading, setLoading] = useState(true);

  const createDates = async () => {

    const showsList = data as TVShowType[];

    for (let i = 0; i < showsList.length; i++) {
      const show = showsList[i];
      const showName = show.name?.toLowerCase().replace(/[\W_]+/g, "-")

      //if (showName !== "one-piece" && showName !== "boruto-naruto-next-generations") continue;

      if (show.next_episode_to_air && show.name && show.name.length > 0) {

        const data = await traktShow({ slug: showName })


        console.log(data, show, 'traktshow')

        //@ts-ignore
        const sourceDate = show.next_episode_to_air.air_date + " " + data.airs.time
        dayjs.tz.setDefault(data.airs.timezone)

        let episodesLeft = 0;
        if (show.next_episode_to_air.episode_number > show.seasons[show.seasons.length - 1].episode_count) {
          episodesLeft = show.number_of_episodes - show.next_episode_to_air.episode_number + 1;;
        } else {
          episodesLeft = show.seasons[show.seasons.length - 1].episode_count - show.next_episode_to_air.episode_number + 1;
        }

        console.log(episodesLeft, show.seasons[show.seasons.length - 1].season_number, 'test');

        for (let i = 0; i < episodesLeft; i++) {

          setShowsList((prev) => [...prev, {
            name: show.name,
            date: dayjs.tz(sourceDate).local().add(i, "weeks").toDate(),
            id: show.id,
            poster_path: show.poster_path,
            season: show.next_episode_to_air && show.next_episode_to_air.season_number,
            episode: show.next_episode_to_air && show.next_episode_to_air.episode_number + i
          }])
        }

      }

    }

    setLoading(false);
  }

  useEffect(() => {
    if (!data) return;
    createDates();


    return () => {
      setShowsList([]);
    }
  }, [data])


  return (
    <Container className="">
      <p className="text-gray-400 text-sm mt-4 mb-1 text-right">*Times converted to your local timezone ({new Date()
        .toLocaleDateString('en-US', {
          day: '2-digit',
          timeZoneName: 'long',
        })
        .slice(4)})</p>
      <Calendar shows={showsList} loading={loading} />
    </Container>
  )
}

export default CalendarPage

CalendarPage.requireAuth = true;
