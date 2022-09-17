import { Indicator, Tooltip, HoverCard, Text } from '@mantine/core';
import { CalendarBase } from '@mantine/dates';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react'
import useSWR from 'swr';
import fetcher from '../helpers/fetcher';

const BEARER = process.env.NEXT_PUBLIC_TVDB_API_KEY

const Calendar = () => {
  const { data, error } = useSWR<any>(
    "/api/user/list?list=watched",
    fetcher
  );

  const [showsList, setShowsList] = useState<any[]>([]);

  const fetchIdk = async () => {
    let shows = []

    for (let i = 0; i < data.shows.length; i++) {
      const showId = data.shows[i].id;

      let res = await fetch(`https://api4.thetvdb.com/v4/search/remoteid/${showId}`, {
        headers: {
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_TBDB_API_KEY}`
        }
      });

      let { data: results } = await res.json();

      const show = results.filter((item: any) => {
        if (item.hasOwnProperty("series")) {
          return true;
        }
        else return false;
      })[0].series

      shows.push(show);
    }

    for (let i = 0; i < shows.length; i++) {
      const showId = shows[i].id as number;

      let res = await fetch(`https://api4.thetvdb.com/v4/series/${showId}/extended`, {
        headers: {
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_TBDB_API_KEY}`
        }
      });

      let { data } = await res.json();

      if (data.originalLanguage !== "eng") {
        let res = await fetch(`https://api4.thetvdb.com/v4/series/${showId}/translations/eng`, {
          headers: {
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_TBDB_API_KEY}`
          }
        });

        let { data: translations } = await res.json();
        data.name = translations.name;
      }

      shows[i] = data;
    }
    setShowsList(shows);
    console.log(shows, 'movies!')
  }

  useEffect(() => {
    if (!data) return;
    fetchIdk();
  }, [data])

  const [value, setValue] = useState<Date>();

  return (
    <div className="flex flex-col space-y-4">
      {false && showsList.map((show: any) => (
        <div>
          <p> {show.name}</p>
          {Object.keys(show.airsDays).map((day) => {
            if (show.airsDays[day]) {
              return day;
            }
          })}

          <p>{show.airsTime}</p>
        </div>
      ))}

      <CalendarBase
        renderDay={(date) => {
          const day = date.getDate();
          let isAirDate = false;
          let showAiring = { name: "" };

          showsList.forEach((show) => {
            if (show.nextAired === dayjs(date).format("YYYY-MM-DD")) {
              isAirDate = true;
              showAiring = show;
            }
          })
          if (isAirDate) {
            return (
              // <Tooltip label={showAiring?.name} className="w-full h-full">
              //   <Indicator size={6} color="red" offset={8}>
              //     <div>{day}</div>
              //   </Indicator>
              // </Tooltip>
              <HoverCard width={280} shadow="md">
                <HoverCard.Target>
                  <Indicator size={6} color="red" offset={8}>
                    <div>{day}</div>
                  </Indicator>
                </HoverCard.Target>
                <HoverCard.Dropdown>
                  <Text size="sm">
                    {showAiring?.name}
                  </Text>
                </HoverCard.Dropdown>
              </HoverCard>

            )
          } else {
            return <div>{day}</div>
          }
        }}
      />
    </div>
  )
}

export default Calendar
