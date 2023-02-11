import { Container } from "@mantine/core"
import { GetStaticPaths, GetStaticProps } from "next"
import { AggregateCredits, TVShowType } from "../../../constants/types"
import { tmdb } from "../../../utils/tmdb"

type Props = {
    show: TVShowType & { aggregate_credits: AggregateCredits }
}
const credits = ({ show }: Props) => {
    return (
        <Container>Credits</Container>
    )
}
export default credits

export const getStaticProps: GetStaticProps = async (ctx) => {
    const slug = ctx.params?.slug as string;

    const showId = slug.split("-")[0];

    const showData = await tmdb.tvInfo({
        id: showId,
        append_to_response: "aggregate_credits",
    });

    const showName = showData.name?.toLowerCase().replace(/[\W_]+/g, "-")

    if (!slug.split("-").slice(1).join("-")) {
        return {
            redirect: {
                destination: `/show/${showId}-${showName}`,
                permanent: true,
            },
        }
    }

    return {
        props: {
            show: showData,
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