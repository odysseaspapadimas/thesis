import { NextLink } from "@mantine/next";
import Image from "next/image";
import useUser from "../../hooks/use-user";

type Props = {
    username: string;
    lastMessage: { text: string, sent: string, me: boolean };
}

export const default_avatar = "https://media.istockphoto.com/vectors/user-icon-flat-isolated-on-white-background-user-symbol-vector-vector-id1300845620?k=20&m=1300845620&s=612x612&w=0&h=f4XTZDAv7NPuZbG0habSpU0sNgECM0X7nbKzTUta3n8="

const User = ({ username, lastMessage }: Props) => {
    const { user } = useUser({ username: username })
    return (
        <NextLink href={`/messages/${username}`} className="flex items-center">

            <Image src={user?.image_url ? user?.image_url : default_avatar} className="rounded-full" width={40} height={40} />
            <div className="flex flex-col ml-3 ">
                <p className=" font-semibold hover:text-gray-200">{username}</p>
                <p className="text-sm text-gray-400">{lastMessage.me && "Me: "} {lastMessage.text}</p>
            </div>
        </NextLink>
    )
}

export default User