import { Indicator, Tooltip, HoverCard, Text, LoadingOverlay } from '@mantine/core';
import { CalendarBase } from '@mantine/dates';
import { ShowResponse } from 'moviedb-promise';
import React, { useEffect, useState } from 'react'
import useSWR from 'swr';
import fetcher from '../helpers/fetcher';
import { traktShow } from '../utils/trakt';
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone' // dependent on utc plugin
import { NextLink } from '@mantine/next';
import { NextPageWithAuth } from './_app';
dayjs.extend(utc)
dayjs.extend(timezone)

type AiringShow = {
  name: string | undefined;
  date: Date;
  id: number | undefined;
}

const Calendar : NextPageWithAuth = () => {
  const { data, error } = useSWR<ShowResponse[]>(
    "/api/user/calendar",
    fetcher
  );

  const [showsList, setShowsList] = useState<AiringShow[]>([]);

  const [loading, setLoading] = useState(true);

  const createDates = async () => {

    const showsList = data as ShowResponse[];

    for (let i = 0; i < showsList.length; i++) {
      const show = showsList[i];
      const showName = show.name?.toLowerCase().replace(/[\W_]+/g, "-")


      if (show.next_episode_to_air && show.name && show.name.length > 0) {

        const data = await traktShow({ slug: showName })

        console.log(data.airs, 'airs')
        //@ts-ignore
        const sourceDate = show.next_episode_to_air.air_date + " " + data.airs.time
        dayjs.tz.setDefault(data.airs.timezone)

        // The same behavior with dayjs.tz("2014-06-01 12:00", "America/New_York")

        setShowsList((prev) => [...prev, { name: show.name, date: dayjs.tz(sourceDate).local().toDate(), id: show.id }])
      }

    }

    setLoading(false);
  }

  useEffect(() => {
    if (!data) return;
    createDates();
  }, [data])

  return (
    <div className="w-full grid place-items-center">
      <div className="border border-gray-700 rounded-md mt-8 p-2 relative">
        <LoadingOverlay visible={loading} overlayBlur={0.5} />
        <CalendarBase
          renderDay={(date) => {
            const day = date.getDate();
            let isAirDate = false;
            let showAiring = { name: "", date: new Date(), id: 0 } as AiringShow;
            showsList.forEach((show) => {
              if (dayjs(show.date).format("YYYY-MM-DD") === dayjs(date).format("YYYY-MM-DD")) {
                isAirDate = true;
                showAiring = show as AiringShow;
              }
            })
            if (isAirDate) {
              return (
                <HoverCard position='top' width={275} shadow="md" withinPortal openDelay={0} closeDelay={40} transitionDuration={0} exitTransitionDuration={0}>
                  <HoverCard.Target>
                    <Indicator size={6} color="red" offset={8}>
                      <div className={`${dayjs(date).format("YYYY-MM-DD") === dayjs(new Date()).format("YYYY-MM-DD") && "bg-primary"}`}>{day}</div>
                    </Indicator>
                  </HoverCard.Target>
                  <HoverCard.Dropdown className='cursor-default absolute text-center p-1'>
                    {showAiring &&
                      <div className="hover:bg-dark p-1">
                        <NextLink href={`/show/${showAiring.id}`} >
                          <Text size="sm" color="white">
                            {showAiring.name} at {dayjs(showAiring.date).format("hh:mm")}
                          </Text>
                        </NextLink>
                      </div>
                    }
                  </HoverCard.Dropdown>
                </HoverCard>
              )
            } else {
              return <div className={`${dayjs(date).format("YYYY-MM-DD") === dayjs(new Date()).format("YYYY-MM-DD") && "bg-primary rounded-md hover:bg-[hsl(209,77%,38%)]"}`}>{day}</div>
            }
          }}
        />
      </div>
    </div>
  )
}

export default Calendar

Calendar.requireAuth = true;
