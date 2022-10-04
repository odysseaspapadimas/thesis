import { Indicator, Tooltip, HoverCard, Text, LoadingOverlay, Container } from '@mantine/core';
import { CalendarBase } from '@mantine/dates';
import { ShowResponse } from 'moviedb-promise';
import React, { useEffect, useState } from 'react'
import useSWR from 'swr';
import fetcher from '../helpers/fetcher';
import { traktShow } from '../utils/trakt';
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone' // dependent on utc plugin
import { NextPageWithAuth } from './_app';
import Calendar from '../components/Calendar';
import { TVShowType } from '../constants/types';
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


      if (show.next_episode_to_air && show.name && show.name.length > 0) {

        const data = await traktShow({ slug: showName })

        console.log(show, 'traktshow')
        //@ts-ignore
        const sourceDate = show.next_episode_to_air.air_date + " " + data.airs.time
        dayjs.tz.setDefault(data.airs.timezone)

        // The same behavior with dayjs.tz("2014-06-01 12:00", "America/New_York")

        setShowsList((prev) => [...prev, {
          name: show.name,
          date: dayjs.tz(sourceDate).local().toDate(),
          id: show.id,
          poster_path: show.poster_path,
          season: show.next_episode_to_air?.season_number,
          episode: show.next_episode_to_air?.episode_number
        }])
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
    <Container size="xl" className="">
      <Calendar shows={showsList} loading={loading} />
    </Container>
  )
}

export default CalendarPage

CalendarPage.requireAuth = true;
