import { Accordion, Badge, Button, LoadingOverlay } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { NextLink } from "@mantine/next";
import dayjs from "dayjs"
import Image from "next/image";
import { useState } from "react";
import { IMG_URL } from "../../constants/tmdbUrls";
import { AiringShow } from "../../pages/calendar";

type Props = {
    shows: AiringShow[]
    loading: boolean;
}
const Calendar = ({ shows, loading }: Props) => {
    const [curWeek, setCurWeek] = useState(0);

    const matches = useMediaQuery('(min-width: 1400px)', true, { getInitialValueInEffect: true })

    return (
        <div className="border border-gray-700 rounded-md mb-8 w-full">
            <div className="flex justify-between w-full items-center p-4 flex-wrap">
                <Button className="bg-primary order-1" onClick={() => setCurWeek((prev) => prev - 1)}>Previous Week</Button>
                <div className="flex items-center space-x-2 order-3 xl:order-2 mx-auto pt-2">
                    <span>{dayjs().startOf('week').add(curWeek, 'week').format("YYYY")}</span>
                    <Button variant="outline" onClick={() => setCurWeek(0)}>Today</Button>
                </div>
                <Button className="bg-primary order-2 xl:order-3" onClick={() => setCurWeek((prev) => prev + 1)}>Next Week</Button>
            </div>
            <div className="flex flex-col items-center xl:flex-row xl:items-start xl:space-x-4 xl:px-4 xl:py-2 relative xl:overflow-y-auto xl:max-h-calendar scrollbar">

                <LoadingOverlay visible={loading} overlayBlur={1.5} />
                {matches ? (
                    [...new Array(7)].map((_, i) => {
                        const date = dayjs().startOf('week').add(i, 'day').add(curWeek, 'week');
                        return (
                            <div key={date.format("DD MM YYYY")} className={`${date.format("DD MM YYYY") === dayjs(new Date()).format("DD MM YYYY") && "bg-primary"} flex flex-col items-center w-[400px] rounded-sm `}>
                                <h3>{date.format("DD MMM")}</h3>
                                <h2 className="text-lg font-semibold mb-2">{date.format("dddd")}</h2>
                                <div className="flex flex-col space-y-2 items-center w-full ">
                                    {shows.sort((a, b) => a.date.valueOf() - b.date.valueOf()).map((show) => {
                                        const isPremiere = show.season === 1 && show.episode === 1;
                                        const isReturning = show.episode === 1;
                                        //console.log(show, 'episode airing')
                                        return date.format("DD MM YYYY") === dayjs(show.date).format("DD MM YYYY") && (

                                            <NextLink key={show.id + date.format("DD MM YYYY")} href={`/show/${show.id}`} className={`flex flex-col items-center text-center w-full h-[322px] px-1 ${isPremiere ? "bg-green-800 hover:bg-green-900" : isReturning ? "bg-yellow-700 hover:bg-yellow-800" : "bg-dark hover:bg-dark-hover"}`}>
                                                <div className="relative px-2 flex items-center my-2 w-full">
                                                    <span className="absolute left-1 text-sm" >{show.season}x{show.episode}</span>
                                                    <span className="w-full text-center">{dayjs(show.date).format("HH:mm")}</span>
                                                </div>
                                                <Image src={IMG_URL(show.poster_path)} width={145} height={217.5} layout="fixed" />
                                                <p className="my-auto p-1 break-words whitespace-pre-wrap font-semibold">
                                                    {show.name}
                                                </p>
                                            </NextLink>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <Accordion defaultValue={dayjs(new Date()).format("DD MM YYYY")} className="w-full flex flex-col" classNames={{ chevron: "m-0" }}>
                        {[...new Array(7)].map((_, i) => {
                            const date = dayjs().startOf('week').add(i, 'day').add(curWeek, 'week');
                            const isToday = date.format("DD MM YYYY") === dayjs(new Date()).format("DD MM YYYY")
                            let count = 0;
                            for (let i = 0; i < shows.length; i++) {
                                if (date.format("DD MM YYYY") === dayjs(shows[i].date).format("DD MM YYYY")) {
                                    count++;
                                }
                            }

                            return (
                                <Accordion.Item key={date.format("DD MM YYYY")} value={date.format("DD MM YYYY")} className={` ${isToday && "bg-primary hover:bg-primary"}`} style={{ order: isToday ? -1 : i + 1 }}>
                                    <Accordion.Control className={`relative flex flex-col-reverse items-center`}>
                                        <div className="flex flex-col items-center">
                                            <h3>{date.format("DD MMM")}</h3>
                                            <h2 className="text-lg font-semibold mb-2">{date.format("dddd")}</h2>
                                            <div className="border-b w-full absolute left-0 bottom-8"></div>
                                            <Badge color="gray" variant="filled" className="absolute right-3">{count}</Badge>
                                        </div>
                                    </Accordion.Control>
                                    <Accordion.Panel>
                                        <div className="flex flex-col space-y-2 items-center w-full">
                                            {shows.map((show) => (
                                                date.format("DD MM YYYY") === dayjs(show.date).format("DD MM YYYY") && (

                                                    <NextLink key={show.id + date.format("DD MM YYYY")} href={`/show/${show.id}`} className={`flex flex-col items-center text-center w-full px-1 pb-2 ${show.season === 1 && show.episode === 1 ? "bg-red-800 hover:bg-red-900" : show.episode === 1 ? "bg-yellow-700 hover:bg-yellow-800" : "bg-dark hover:bg-dark-hover"}`}>
                                                        <div className="relative px-2 flex items-center my-2 w-full">
                                                            <span className="absolute left-0 text-sm pl-1" >{show.season}x{show.episode}</span>
                                                            <span className="w-full text-center">{dayjs(show.date).format("HH:mm")}</span>
                                                        </div>
                                                        <Image src={IMG_URL(show.poster_path)} width={125} height={187.5} layout="fixed" />
                                                        <span className="break-words whitespace-pre-wrap font-semibold">
                                                            {show.name}
                                                        </span>
                                                    </NextLink>
                                                )
                                            ))}
                                            {count === 0 && <p>No shows airing this day.</p>}
                                        </div>
                                    </Accordion.Panel>
                                </Accordion.Item>
                            )
                        })}

                    </Accordion>
                )}
            </div>
        </div >
    )
}
export default Calendar