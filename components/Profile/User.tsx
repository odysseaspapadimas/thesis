import { Button } from "@mantine/core"
import { NextLink } from "@mantine/next"
import Image from "next/image"
import { Dispatch, SetStateAction } from "react"
import { State, TUser } from "./FollowersFollowing"

const User = ({ data, setOpened }: { data: TUser; setOpened: Dispatch<SetStateAction<State>> }) => {
    return (
        <div className="flex items-center">
            <NextLink onClick={() => setOpened((prev) => ({...prev, opened: false}))} href={`/u/${data.username}`} className="w-10 h-10">
                <Image src={data.image_url} className="rounded-full" width={40} height={40} />
            </NextLink>
            <NextLink onClick={() => setOpened((prev) => ({...prev, opened: false}))} href={`/u/${data.username}`} className="ml-4 ">
                <p className="text-lg font-semibold hover:text-gray-200">
                    {data.username}
                </p>
            </NextLink>

            {/* <Button onClick={handleToggleFollow} className={`${!isFollowing ? 'bg-primary' : 'bg-gray-700 hover:bg-gray-800'} my-4 sm:my-0`}>{!isFollowing ? 'Follow' : 'Unfollow'}</Button> */}
        </div>
    )
}

export default User