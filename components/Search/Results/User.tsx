import { NextLink } from "@mantine/next"
import Image from "next/image"
import { User } from "../../../constants/types"

const User = ({ data }: { data: User }) => {
    return (
        <div className="flex ml-[12.5px] items-center">
            <NextLink href={`/u/${data.username}`}>
                <Image src={data.image_url} className="rounded-full" width={75} height={75} />
            </NextLink>
            <NextLink href={`/u/${data.username}`} className="ml-[24.5px] text-lg font-semibold"> {/* 12px + 12.5px */}

                {data.username}

            </NextLink>
        </div>
    )
}

export default User