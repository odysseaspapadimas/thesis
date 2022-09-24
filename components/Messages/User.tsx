import { NextLink } from "@mantine/next";
import dayjs from "dayjs";
import Image from "next/image";
import { useRouter } from "next/router";
import { Message } from "../../constants/types";
import useUser from "../../hooks/use-user";

type Props = {
    username: string;
    lastMessage: Message;
}

export const default_avatar = "https://media.istockphoto.com/vectors/user-icon-flat-isolated-on-white-background-user-symbol-vector-vector-id1300845620?k=20&m=1300845620&s=612x612&w=0&h=f4XTZDAv7NPuZbG0habSpU0sNgECM0X7nbKzTUta3n8="

const User = ({ username, lastMessage }: Props) => {
    const { user } = useUser({ username })
    const router = useRouter();

    return (
        <NextLink href={`/messages/${username}`} className={`flex items-center relative border border-dark hover:bg-dark ${username === router.query.username && "bg-dark"} px-2 py-2 rounded-md`}>
            <Image src={user?.image_url ? user?.image_url : default_avatar} className="rounded-full" width={40} height={40} />
            <div className={`flex flex-col ml-3 max-w-[250px] ${!lastMessage.me && !lastMessage.read.state ? "text-white" : "text-gray-400"}`}>
                <p className="font-semibold hover:text-gray-200">{username}</p>
                <div className="flex items-center space-x-2 ">
                    <p className={`text-sm text-ellipsis overflow-hidden whitespace-nowrap block`}>{lastMessage.me && "You: "} {lastMessage.text ? lastMessage.text : lastMessage.media_name}</p>
                    <p className="text-sm">{dayjs(lastMessage.sent).format("HH:mm")}</p>
                </div>
            </div>
            {!lastMessage.me && !lastMessage.read.state &&
                <div className="absolute top-2 right-2 h-3 w-3 rounded-full bg-primary grid place-items-center text-xs font-medium"></div>
            }
        </NextLink >
    )
}

export default User