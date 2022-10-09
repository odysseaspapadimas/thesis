import { Button, Loader } from "@mantine/core";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import useUser from "../../hooks/use-user";
import { default_avatar } from "../Messages/User";

type Props = {
    onClick: (otherUser: string) => Promise<boolean>;
    username: string;
}
const User = ({ onClick, username }: Props) => {
    const { user } = useUser({ username })
    const [loading, setLoading] = useState(false);
    const [buttonText, setButtonText] = useState("Send");

    const handleClick = async () => {
        setLoading(true);
        const successfull = await onClick(user.username);

        console.log(successfull, ' ok')

        setLoading(!successfull);
        setButtonText("Sent")
        setTimeout(() => {
            setButtonText("Send")
        }, 1000)
    }

    return (
        <div className="flex items-center px-2 py-2 rounded-md">
            <Image src={user?.image_url ? user?.image_url : default_avatar} className="rounded-full" width={40} height={40} />
            <p className="font-semibold hover:text-gray-200 ml-3">{username}</p>
            <Button onClick={!loading ? handleClick : undefined} className="bg-primary ml-auto" size="xs">
                {loading ? (
                    <Loader size={29.31} variant="dots" style={{ fill: "white" }} />
                ) : (
                    <> {buttonText}</>
                )}
            </Button>
        </div >
    )
}
export default User