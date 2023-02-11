import { Center, Container, Loader } from "@mantine/core"
import fetcher from "../helpers/fetcher"
import useSWR from "swr"
import { Activity } from "../constants/types"
import Image from "next/image"
import dayjs from "dayjs"
import { NextLink } from "@mantine/next"
import relativeTime from 'dayjs/plugin/relativeTime'
import updateLocale from 'dayjs/plugin/updateLocale'
import Head from "next/head"
import { NextPageWithAuth } from "./_app"
import { useMediaQuery } from "@mantine/hooks"
dayjs.extend(relativeTime)

const ActivityPage: NextPageWithAuth = () => {

    const { data, error } = useSWR<any>("/api/user/activity", fetcher)

    console.log(data, ' activity')

    const isMobile = useMediaQuery('(max-width: 768px)', true, { getInitialValueInEffect: false });

    return (
        <>
            <Head>
                <title>Activity</title>
            </Head>
            <Container py={36}>
                <h1>Activity</h1>
                <div className="mx-auto flex flex-col space-y-4 ">
                    {data && data.length > 0 ? data.map((activity: Activity) => (
                        <div key={String(activity.createdAt)} className="flex items-center space-x-4 w-full text-sm md:text-base">
                            <NextLink href={`/u/${activity.user.username}`} className="next-link rounded-full border-2 border-transparent hover:border-primary">
                                <Image src={activity.user.image_url} width={30} height={30} className="rounded-full" layout="fixed" />
                            </NextLink>
                            <p className="text-gray-300">
                                <NextLink href={`/u/${activity.user.username}`}>
                                    <span className="font-bold hover:text-gray-200">
                                        {activity.user.username}
                                    </span>
                                </NextLink>
                                {activity.type === "watched" ? (
                                    <> watched <MediaLink id={activity.media.id} media_type={activity.media.type} media_name={activity.media.media_name} /> on {dayjs(activity.createdAt).format("dddd MMM DD, YYYY")} </>
                                ) : activity.type === "plan" ? (
                                    <> added <MediaLink id={activity.media.id} media_type={activity.media.type} media_name={activity.media.media_name} /> to their plan to watch list</>
                                ) : (
                                    <> liked <MediaLink id={activity.media.id} media_type={activity.media.type} media_name={activity.media.media_name} /></>
                                )}
                            </p>
                            {!isMobile &&
                                <p className="text-gray-300 text-sm flex-1 text-right">{dayjs().to(activity.createdAt)}</p>
                            }
                        </div>
                    )) : !data ? (
                        <Center py={24}>
                            <Loader />
                        </Center>
                    ) : data && data.length === 0 && (
                        <p >No activity yet...</p>
                    )}
                </div>
            </Container>
        </>
    )
}

ActivityPage.requireAuth = true

export default ActivityPage

const MediaLink = ({ id, media_type, media_name }: { id: string, media_type: "movie" | "show", media_name: string }) => {
    return (
        <NextLink href={`/${media_type}/${id}`}>
            <span className="font-bold hover:text-gray-200 underline underline-offset-2">{media_name}</span>
        </NextLink>
    )
}