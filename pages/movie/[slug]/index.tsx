import { Container, Loader, RingProgress, Text } from "@mantine/core";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import useSWR, { SWRConfig } from "swr";
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
import { Genre, MovieType } from "../../../constants/types";
import { CreditsResponse } from "moviedb-promise";
import Credits from "../../../components/Credits";
import Head from "next/head";
import { NextLink } from "@mantine/next";
import Recommend from "../../../components/Recommend";
import { showNotification as _showNotification } from "@mantine/notifications";
import FriendActivity from "../../../components/FriendActivity";
import { ChevronRight } from "tabler-icons-react";
import Rate from "../../../components/List/Rate";
import dbConnect from "../../../lib/dbConnect";
import Media from "../../../models/Media";
import RatingRing from "../../../components/RatingRing";
import Review from "../../../components/Review";

const Movie = ({
    movie,
    media: mediaData,
    fallback
}: {
    movie: MovieType & { credits: CreditsResponse };
    media: any;
    fallback: any;
}) => {
    const router = useRouter();

    const slug = router.query.slug as string;

    const movieId = slug.split("-")[0];

    const { data: session, status } = useSession();

    const { user, error: userError } = useUser({ session });

    const { data: media } = useSWR(`/api/user/review?id=${movieId}&type=movie`, fetcher)

    const type = "movie"; //What kind of media is this to make seperate calls when adding/removing from lists

    const {
        data: onList,
        error: onListError,
        mutate: mutateOnList,
    } = useSWR(
        user
            ? `/api/user/list/onList?username=${user.username}&id=${movieId}&type=${type}`
            : null,
        fetcher
    );

    useEffect(() => {
        //console.log(router);
        console.log(onList, "onList");
    }, [onList]);

    if (!movie) {
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
            await addToList("watched", movieId, type);

            showNotification({
                title: "Added to Already Watched list",
                msg: `'${movie.title}' was successfully added to your list`,
                list: "watched"
            });

            if (onList.on.includes("plan")) {
                await removeFromList("plan", movieId, type);
                showNotification({
                    title: "Removed from Plan to Watch list",
                    msg: `'${movie.title}' was successfully removed from your list`,
                    list: "plan"
                });
            }
        } else if (onList.on.includes("watched")) {
            await removeFromList("watched", movieId, type);
            showNotification({
                title: "Removed from Already Watched list",
                msg: `'${movie.title}' was successfully removed from your list`,
                list: "plan"
            });
        }

        mutateOnList();
    };

    const handlePlan = async () => {
        if (!onList.on.includes("plan")) {
            await addToList("plan", movieId, type);

            showNotification({
                title: "Added to Plan to Watch list",
                msg: `'${movie.title}' was successfully added to your list`,
                list: "plan"
            });

            if (onList.on.includes("watched")) {
                await removeFromList("watched", movieId, type);
                showNotification({
                    title: "Removed from Already Watched list",
                    msg: `'${movie.title}' was successfully removed from your list`,
                    list: "watched"
                });
            }
        } else if (onList.on.includes("plan")) {
            await removeFromList("plan", movieId, type);
            showNotification({
                title: "Removed from Plan to Watch list",
                msg: `'${movie.title}' was successfully removed from your list`,
                list: "plan"
            });
        }
        mutateOnList();
    };

    const handleFavorite = async () => {
        console.log("hi");
        if (!onList.on.includes("favorites")) {
            await addToList("favorites", movieId, type);
            showNotification({
                title: "Added to Favorites list",
                msg: `'${movie.title}' was successfully added to your list`,
                list: "favorites"
            });
        } else if (onList.on.includes("favorites")) {
            await removeFromList("favorites", movieId, type);
            showNotification({
                title: "Removed from Favorites list",
                msg: `'${movie.title}' was successfully removed from your list`,
                list: "favorites"
            });
        }
        mutateOnList();
    };

    return (
        <SWRConfig value={{ fallback }}>
            <div>
                <Head>
                    <title>{movie.title}</title>
                </Head>
                <div className="relative">
                    <div className="absolute top-0 left-0 w-full h-full brightness-[0.25]">
                        <img
                            src={IMG_URL(movie.backdrop_path)}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <Container
                        className="relative h-full grid place-items-center sm:flex sm:items-center py-10 sm:py-20"
                    >

                        <div className="flex flex-col items-center justify-center">
                            <Image
                                height={450}
                                width={300}
                                src={IMG_URL(movie.poster_path)}
                                className="rounded-md flex-1"
                                placeholder="blur"
                                blurDataURL={`/_next/image?url=${IMG_URL(
                                    movie.poster_path
                                )}&w=16&q=1`}
                            />


                            {session &&
                                <FriendActivity type={type} id={movieId} />
                            }
                        </div>

                        <div className="flex-1 flex flex-col mt-8 sm:max-w-2xl sm:ml-8">
                            <div className="flex">
                                <p className="text-3xl font-semibold">
                                    {movie.title}
                                    <span className="text-2xl">
                                        {" "}
                                        ({movie.release_date.split("-")[0]})
                                    </span>
                                </p>
                            </div>

                            <div className="flex space-x-2">
                                {movie.release_date} &bull;{" "}
                                {movie.genres.map((genre: Genre, i: number) => (
                                    <React.Fragment key={i}>
                                        <NextLink href={`/movies?genres=${genre.name.split(" ")[0].toLowerCase()}`} className="hover:underline">
                                            {genre.name}
                                        </NextLink>
                                        {i < movie.genres.length - 1 && ", "}
                                    </React.Fragment>
                                ))}{" "}
                                &bull; {movie.runtime}m
                            </div>

                            <div className="flex items-center flex-col sm:flex-row sm:my-4">
                                <RatingRing vote_average={movie.vote_average} vote_count={movie.vote_count} media={mediaData} />

                                {user && (
                                    <div className="flex flex-col space-y-4 sm:ml-8">
                                        <div className="flex justify-around items-center space-x-8">
                                            <AlreadyWatched onList={onList} handler={handleWatched} />
                                            <PlanToWatch onList={onList} handler={handlePlan} />
                                            <Favorite onList={onList} handler={handleFavorite} />
                                            <Rate id={movieId} type={type} onList={onList} ratings={user.ratings} username={user.username} image_url={user.image_url} mutate={mutateOnList} />
                                        </div>
                                        <Recommend user={user.username} users={user.messages} movie={movie} />
                                    </div>
                                )}
                            </div>

                            <div>
                                <p className="text-2xl font-medium my-2">Overview</p>
                                <Text>
                                    {movie.overview
                                        ? movie.overview
                                        : "There's no available overview."}
                                </Text>
                            </div>
                        </div>
                    </Container>
                </div>

                <Container>
                    <Credits credits={movie.credits} />

                    <div className="pb-8">
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

export default Movie;

export const getStaticProps: GetStaticProps = async (ctx) => {
    const slug = ctx.params?.slug as string;

    const movieId = slug.split("-")[0];

    const movieData = await tmdb.movieInfo({
        id: movieId,
        append_to_response: "credits",
    });

    await dbConnect()
    const media = await Media.findOne({ id: movieId, type: "movie" })

    let media_vote_average = 0 as number | null;

    if (media && media.ratings.length > 0 && media_vote_average === 0) {
        for (let i = 0; i < media.ratings.length; i++) {
            media_vote_average += media.ratings[i].rating
        }

        media_vote_average = media_vote_average / media.ratings.length;
    } else {
        media_vote_average = null;
    }



    if (movieData.vote_average && movieData.vote_count && media_vote_average) {
        movieData.vote_average = (((movieData.vote_average * movieData.vote_count) + (media_vote_average * 2)) / (media.ratings.length + movieData.vote_count))
    } else if (media_vote_average) {
        movieData.vote_average = media_vote_average * 2;
    }

    return {
        props: {
            movie: movieData,
            media: JSON.parse(JSON.stringify({
                ratings: media?.ratings,
                vote_average: media_vote_average,
                vote_count: media?.ratings.length ?? 0,
            })),
            fallback: {
                [`/api/user/review?id=${movieId}&type=movie`]: JSON.parse(JSON.stringify(media))
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
