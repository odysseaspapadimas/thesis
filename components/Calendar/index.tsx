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
        <div className="border border-gray-700 rounded-md my-8 w-full">
            <div className="flex justify-between w-full items-center p-4 ">
                <Button className="bg-primary" onClick={() => setCurWeek((prev) => prev - 1)}>Previous Week</Button>
                <Button className="bg-primary" onClick={() => setCurWeek((prev) => prev + 1)}>Next Week</Button>
            </div>
            <div className="flex flex-col items-center xl:flex-row xl:items-start xl:space-x-4 px-4 pb-2 relative xl:overflow-y-scroll xl:h-calendar">

                <LoadingOverlay visible={loading} overlayBlur={1.5} />
                {matches ? (
                    [...new Array(7)].map((_, i) => {
                        const date = dayjs().startOf('week').add(i, 'day').add(curWeek, 'week');
                        return (
                            <div className={`${date.format("DD MM YYYY") === dayjs(new Date()).format("DD MM YYYY") && "bg-primary"} flex flex-col items-center w-[400px] rounded-sm `}>
                                <h3>{date.format("DD MMM")}</h3>
                                <h2 className="text-lg font-semibold mb-2">{date.format("dddd")}</h2>
                                <div className="flex flex-col space-y-2 items-center w-full ">
                                    {shows.sort((a, b) => a.date.valueOf() - b.date.valueOf()).map((show) => (
                                        date.format("DD MM YYYY") === dayjs(show.date).format("DD MM YYYY") && (

                                            <NextLink href={`/show/${show.id}`} className={`text-center w-full px-1 pb-2 ${show.season === 1 && show.episode === 1 ? "bg-red-800 hover:bg-red-900" : show.episode === 1 ? "bg-yellow-700 hover:bg-yellow-800" : "bg-dark hover:bg-dark-hover"}`}>
                                                <div className="relative px-2 flex items-center my-2">
                                                    <span className="absolute left-1 text-sm" >{show.season}x{show.episode}</span>
                                                    <span className="w-full text-center">{dayjs(show.date).format("HH:mm")}</span>
                                                </div>
                                                <Image src={IMG_URL(show.poster_path)} width={145} height={217.5} layout="fixed" />
                                                <p className="break-words whitespace-pre-wrap font-semibold">
                                                    {show.name}
                                                </p>
                                            </NextLink>
                                        )
                                    ))}
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
                                <Accordion.Item value={date.format("DD MM YYYY")} className={` ${isToday && "bg-primary hover:bg-primary"}`} style={{ order: isToday ? -1 : i + 1 }}>
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

                                                    <NextLink href={`/show/${show.id}`} className={`text-center w-full px-1 pb-2 ${show.season === 1 && show.episode === 1 ? "bg-red-800 hover:bg-red-900" : show.episode === 1 ? "bg-yellow-700 hover:bg-yellow-800" : "bg-dark hover:bg-dark-hover"}`}>
                                                        <div className="relative px-2 flex items-center my-2">
                                                            <span className="absolute left-0 text-sm pl-1" >{show.season}x{show.episode}</span>
                                                            <span className="w-full text-center">{dayjs(show.date).format("HH:mm")}</span>
                                                        </div>
                                                        <Image src={IMG_URL(show.poster_path)} width={125} height={187.5} layout="fixed" />
                                                        <p className="break-words whitespace-pre-wrap font-semibold">
                                                            {show.name}
                                                        </p>
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