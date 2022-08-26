import React from 'react'
import useSWR from 'swr';
import fetcher from '../helpers/fetcher';

const Calendar = () => {
    const { data, error } = useSWR<any>(
        "/api/user/list?list=watched",
        fetcher
      );

      console.log(data, 'data');
  return (
    <div>Calendar</div>
  )
}

export default Calendar
