import useSWR from "swr";
import fetcher from "../../helpers/fetcher";
import { User as UserType } from "../../constants/types";
import User from "./User";
import { Loader } from "@mantine/core";

type Props = {
    type: string;
    id: string;
}
const FriendActivity = ({ type, id }: Props) => {
    const { data } = useSWR(`/api/user/mediaActivity?type=&id=${id}`, fetcher);

    return (
        data && data.length > 0 ? (
            <div className="mt-2">
                <h3 className="text-lg text-center font-semibold mb-2">Friend Activity</h3>
                <div className="flex justify-center items-center space-x-4 flex-wrap">
                    {data ? data.map((({ list, _doc: user }: { list: string, _doc: UserType }) => (
                        <User key={user.username} username={user.username} list={list} />
                    ))) : (
                        <Loader />
                    )}
                </div>
            </div>
        ) : null
    )
}
export default FriendActivity