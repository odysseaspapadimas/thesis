import useSWR from "swr";
import { ListData, RatingItem } from "../../../constants/types";
import fetcher from "../../../helpers/fetcher";
import { MovieType } from "../../../constants/types";
import { TVShowType } from "../../../constants/types";
import Show from "../../Show";
import { Rating } from "@mantine/core";

type Props = {
    review: RatingItem
    data: MovieType | TVShowType | undefined
}
const Review = ({ review, data }: Props) => {

    return (
        <div className="flex space-x-4 w-full">
            <div className="flex-1">
                {data && <Show data={data} />}
            </div>

            <div className="py-4 flex-[4]">
                <Rating value={review.rating} fractions={2} readOnly />

                <p>{review.review}</p>
            </div>
        </div>
    )
}
export default Review