import { Container } from "@mantine/core";
import { NextLink } from "@mantine/next";
import dayjs from "dayjs";
import { TvSeasonResponse } from "moviedb-promise";
import { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/image";
import { useRouter } from "next/router"
import { ArrowBack, ArrowLeft, Star } from "tabler-icons-react";
import { IMG_URL } from "../../../../constants/tmdbUrls";
import { Airs, TVShowType } from "../../../../constants/types";
import { tmdb } from "../../../../utils/tmdb";
import { traktShow } from "../../../../utils/trakt";

type Props = {
    show: TVShowType;
    season: TvSeasonResponse;
}

const Season = ({ show, season }: Props) => {
    const router = useRouter();

    console.log(season, 'season router')
    return (
        <>
            <header className=" bg-primary">
                <Container size="xl" className="flex items-center space-x-4 py-4">
                    {season.poster_path &&
                        <Image src={IMG_URL(season.poster_path)} alt="season poster path" width={75} height={125} className="rounded-md" />
                    }
                    <div>
                        <h1 className='font-semibold'>{season.name} <span className="text-gray-300 font-normal">({season.air_date?.split("-")[0]})</span></h1>
                        <NextLink href={`/show/${router.query.slug}/seasons`}>
                            <div className="flex items-center space-x-2 text-gray-200 hover:text-gray-300">
                                <ArrowLeft className="" />
                                <span className="text-sm ">Go back to seasons lists</span>
                            </div>
                        </NextLink>
                    </div>
                </Container>
            </header>
            <Container size="xl" className="mt-4">
                <h2 className="text-xl font-semibold mb-2">Episodes <span className="text-gray-300 font-normal">{season.episodes?.length}</span> </h2>

                <div className="flex flex-col space-y-8 pb-4">
                    {season.episodes?.map((episode) => (
                        <div key={episode.id} className="flex flex-col md:flex-row items-center md:space-x-4 w-full">
                            {episode.still_path ?
                                (

                                    <img src={IMG_URL(episode.still_path)} alt="episode image" className="md:rounded-l-md my-3 md:my-0  md:w-[217px] md:h-[117px]" />
                                ) : (
                                    <div className="md:rounded-l-md my-3 md:my-0 md:w-[217px] md:h-[117px] bg-dark"></div>
                                )
                            }
                            <div className="w-full">
                                <div className="w-full flex flex-col md:flex-row md:items-start">
                                    <div className="flex items-center space-x-3 order-2 md:order-1">
                                        <span className="font-semibold">{episode.episode_number}</span>
                                        {episode.vote_average &&
                                            <div className="flex items-center space-x-1 rounded-md py-1 px-2" style={{ backgroundColor: `hsl(${(85 * episode.vote_average) / 10}, 100%, 28%)` }}>
                                                <Star size={20} />
                                                <span>{Math.round(episode.vote_average * 10) / 10}</span>
                                            </div>
                                        }
                                        <h3 className="font-semibold break-words">{episode.name}</h3>
                                    </div>

                                    <div className="flex flex-col text-sm text-gray-300 break-all self-end text-right order-1 md:order-2 md:ml-auto" >
                                        <span>{dayjs(episode.air_date).format("MMM DD, YYYY")}</span>
                                        <span>{show.episode_run_time}m</span>
                                    </div>
                                </div>

                                <p className="text-sm mt-3">{episode.overview}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </>
    )
}

export default Season

export const getStaticProps: GetStaticProps = async (ctx) => {
    const slug = ctx.params?.slug as string;

    const showId = slug.split("-")[0];
    const season_number = Number(ctx.params?.season);

    const showData = await tmdb.tvInfo({
        id: showId,
        append_to_response: "aggregate_credits,",
    });

    const season = await tmdb.seasonInfo({ id: showId, season_number })

    const showName = showData.name?.toLowerCase().replace(/[\W_]+/g, "-")

    if (!slug.split("-").slice(1).join("-")) {
        return {
            redirect: {
                destination: `/show/${showId}-${showName}/season/${ctx.params?.season}`,
                permanent: true,
            },
        }
    }

    return {
        props: {
            show: showData,
            season
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