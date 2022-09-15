import { NextLink } from "@mantine/next"
import Image from "next/image";
import useUser from "../../hooks/use-user"
import { default_avatar } from "./User";

const UserToSend = ({ onClick, username }: { onClick: any; username: string }) => {



    const { user } = useUser({ username });

    return (
        <NextLink onClick={onClick} href={`/messages/${username}`} className="flex items-center hover:bg-dark px-2 py-2 rounded-md">
            <Image src={user?.image_url ? user?.image_url : default_avatar} className="rounded-full" width={40} height={40} />
            <p className="font-semibold hover:text-gray-200 ml-3">{username}</p>
        </NextLink>
    )
}

export default UserToSend