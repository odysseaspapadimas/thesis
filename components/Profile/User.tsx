import { Button } from "@mantine/core"
import { NextLink } from "@mantine/next"
import Image from "next/image"
import { Dispatch, SetStateAction } from "react"
import { State, TUser } from "./FollowersFollowing"

const User = ({ data, setOpened }: { data: TUser; setOpened: Dispatch<SetStateAction<State>> }) => {
    return (
        <NextLink href={`/u/${data.username}`} onClick={() => setOpened((prev) => ({ ...prev, opened: false }))} className="flex items-center my-2 hover:bg-dark rounded-md p-2">

            <Image src={data.image_url} className="rounded-full w-10 h-10 " width={40} height={40} />

            <p className="ml-4 text-lg font-semibold hover:text-gray-200">
                {data.username}
            </p>

            {/* <Button onClick={handleToggleFollow} className={`${!isFollowing ? 'bg-primary' : 'bg-gray-700 hover:bg-gray-800'} my-4 sm:my-0`}>{!isFollowing ? 'Follow' : 'Unfollow'}</Button> */}
        </NextLink>
    )
}

export default User