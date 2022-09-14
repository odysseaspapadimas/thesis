import { ActionIcon, Button, Container, TextInput } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { NextLink } from "@mantine/next";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router"
import { ReactElement } from "react";
import { ArrowLeft } from "tabler-icons-react";
import MessagesLayout from "../../components/Layouts/MessagesLayout";
import MessageBox from "../../components/Messages/MessageBox";
import { default_avatar } from "../../components/Messages/User";
import useUser from "../../hooks/use-user";

const Message = () => {

    const router = useRouter();

    const matches = useMediaQuery('(min-width: 900px)', true);

    const { username } = router.query;

    const { user } = useUser({ username })

    const { data: session } = useSession();

    const { user: myUser } = useUser({ session });

    const test = async () => {
        let res = await fetch('/api/user/messages?otherUser=zetidi', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user: myUser.username,
                otherUser: user.username,
                text: 'this is cool',
                image_url: user.image_url
            }),
        });

        const idk = await res.json();

        console.log(idk, 'response');
    }

    return (
        !matches ? (
            <Container size="lg" className="relative h-screen-minus-header flex flex-col">
                <div className="flex items-center py-2">
                    <NextLink className="flex-1" href={"/messages"}>
                        <ArrowLeft size={28} />
                    </NextLink>
                    <div className="flex-[2] flex justify-center items-center space-x-2">
                        <Image src={!user?.image_url ? default_avatar : user.image_url} className="rounded-full" width={32} height={32} />
                        <NextLink href={`/u/${username}`}>
                            <p className="font-semibold text-lg">{username} </p>
                        </NextLink>
                    </div>
                    <div className="flex-1"></div>
                </div>
                <span className="border-b border-solid border-[rgb(44,46,51)] absolute w-full left-0 top-12"></span>

                <MessageBox />
                <TextInput className="mx-auto mt-auto mb-4 w-[95%]" placeholder="Enter message" />
            </Container>
        ) : (
            <MessagesLayout>
                <div className="flex flex-col items-center h-screen-minus-header w-full max-w-2xl pt-2 px-4">
                    <div className="flex items-center space-x-2">
                        <Image src={!user?.image_url ? default_avatar : user.image_url} className="rounded-full" width={36} height={36} />
                        <NextLink href={`/u/${username}`}>
                            <h2 className="text-xl">{username}</h2>
                        </NextLink>
                    </div>
                    <MessageBox />
                    <TextInput className="mx-auto mt-auto mb-4 w-full" placeholder="Enter message" />
                </div>
            </MessagesLayout>
        )
    )
}

export default Message