import useSWR from "swr";
import { ListData, MovieType, RatingItem, TVShowType } from "../../../constants/types";
import fetcher from "../../../helpers/fetcher";
import { Center, Loader } from "@mantine/core";
import List from "../List/List";
import Review from "./Review";

type Props = {
    username: string;
    reviews: RatingItem[] | undefined
}
const Reviews = ({ username, reviews }: Props) => {
    const { data, error } = useSWR<[(MovieType | TVShowType)]>(`/api/user/list?username=${username}&list=reviews`, fetcher);

    console.log(data, 'ratings data')

    if (!data) {
        return (
            <Center my={16}>
                <Loader variant="bars" />
            </Center>
        );
    }
    return (
        <div>


            {reviews && reviews.length > 0 ? (
                <div className="flex flex-col space-y-4 justify-center items-center py-8">
                    {reviews.map((review) => (
                        <Review key={review.id} review={review} data={data.find((item) => review.id === String(item.id))} />
                    ))}
                </div>
            ) : (
                <p className="mt-4">No items on this list...</p>
            )}

        </div>
    )
}
export default Reviews