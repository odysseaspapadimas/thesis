import { GetServerSideProps, GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router"
import dbConnect from "../../../../lib/dbConnect";
import Media from "../../../../models/Media";
import { Container, Rating } from "@mantine/core";
import { tmdb } from "../../../../utils/tmdb";
import { MovieType, TVShowType } from "../../../../constants/types";
import Image from "next/image";
import { IMG_URL } from "../../../../constants/tmdbUrls";
import { NextLink } from "@mantine/next";
import { useMediaQuery } from "@mantine/hooks";

type Props = {
    movie: MovieType
    rating: { username: string, rating: number, review: string, image_url: string }
}

const Review = ({ movie, rating }: Props) => {
    const router = useRouter();

    const isMobile = useMediaQuery('(max-width: 640px)', true, { getInitialValueInEffect: true })

    return (
        <Container py={36} className="flex flex-col ">
            <div className="flex justify-between sm:justify-start">
                <div className="flex flex-col space-y-4 order-1 sm:order-2 sm:ml-4 sm:flex-[3]">
                    <div className="flex items-center space-x-4">
                        <Image src={rating.image_url} width={35} height={35} className="rounded-full" />
                        <p>Review by <NextLink href={`/u/${rating.username}`} className="font-semibold hover:text-gray-300">{rating.username}</NextLink></p>
                    </div>

                    <h2 className="font-semibold hover:text-gray-300"><NextLink href={`/movie/${movie.id}`}>{movie.title}</NextLink>  <span className="text-sm text-gray-300">{movie.release_date.split("-")[0]}</span></h2>

                    <Rating defaultValue={rating.rating} fractions={2} readOnly />

                    {!isMobile && <p>{rating.review}</p>}
                </div>
                <div className="order-2 sm:order-1 sm:flex-1">
                    <Image src={IMG_URL(movie.poster_path)} width={isMobile ? 100 : 150} height={isMobile ? 150 : 225} layout="fixed" className="rounded-md " />
                </div>
            </div>

            {isMobile && <p>{rating.review}</p>}
        </Container>
    )
}
export default Review

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const slug = ctx.params?.slug as string;

    const movieId = slug.split("-")[0];

    const movie = await tmdb.movieInfo({ id: movieId })

    await dbConnect();

    const media = await Media.findOne({ id: movieId, type: "movie" })

    const rating = media.ratings.filter((rating: any) => rating.username === ctx.params?.username)[0]

    console.log(media, rating, 'mediarating')


    if (!rating || rating?.length === 0) {
        return {
            notFound: true,
        }
    }

    return {
        props: {
            movie,
            rating: JSON.parse(JSON.stringify(rating)),
        },
    };
};