import Image from "next/image"
import useUser from "../../hooks/use-user"
import { default_avatar } from "../Messages/User";
import { Eye, Heart, Plus } from "tabler-icons-react";
import { NextLink } from "@mantine/next";
import { useMediaQuery } from "@mantine/hooks";
import { Tooltip } from "@mantine/core";

type Props = {
    username: string;
    list: string;
}
const User = ({ username, list: list }: Props) => {
    const { user } = useUser({ username })

    const isMobile = useMediaQuery('(max-width: 768px)', true, { getInitialValueInEffect: false });

    return (
        <div className="flex flex-col justify-center items-center p-1 rounded-md relative">
            <Tooltip label={username} disabled={isMobile} withArrow>
                <NextLink href={`/u/${username}`}>
                    <Image src={user?.image_url ? user?.image_url : default_avatar} className="rounded-full" width={50} height={50} />
                </NextLink>
            </Tooltip>
            {isMobile &&
                <p className="font-semibold hover:text-gray-200">{username}</p>
            }
            <div className="absolute right-0 top-0 rounded-full p-1 bg-slate-800">
                {list === "plan_to" ? (
                    <Plus size={20} />
                ) : list === "watched" && (
                    <Eye />
                )}
            </div>
        </div>
    )
}
export default User