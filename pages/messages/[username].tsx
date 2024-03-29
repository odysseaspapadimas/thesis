import { ActionIcon, Button, Container, Popover, Textarea, TextInput } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { NextLink } from "@mantine/next";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router"
import { MutableRefObject, useEffect } from "react";
import { useRef } from "react";
import { ChangeEvent, FormEvent, KeyboardEvent, ReactElement, useState } from "react";
import { mutate, useSWRConfig } from "swr";
import { ArrowLeft, Plus } from "tabler-icons-react";
import MessagesLayout from "../../components/Layouts/MessagesLayout";
import MessageBox from "../../components/Messages/MessageBox";
import SendMedia from "../../components/Messages/SendMedia";
import { default_avatar } from "../../components/Messages/User";
import useUser from "../../hooks/use-user";

const Message = () => {

    const router = useRouter();

    const matches = useMediaQuery('(min-width: 900px)', true);

    const { username } = router.query;

    const { user } = useUser({ username })

    const { data: session } = useSession();

    const { user: myUser, mutate: mutateUser } = useUser({ session, options: { refreshInterval: 1000 } });

    const { mutate } = useSWRConfig();

    const sendMessage = async () => {
        let res = await fetch('/api/user/messages?otherUser=zetidi', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user: myUser.username,
                otherUser: user.username,
                text: input,
                image_url: user.image_url
            }),
        });

        const idk = await res.json();

        mutateUser();

        mutate(`/api/user/messages?username=${myUser?.username}`)
    }

    const [input, setInput] = useState("");

    const formRef = useRef() as MutableRefObject<HTMLFormElement>;

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.currentTarget.value)
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && e.shiftKey === false) {
            e.preventDefault();
            formRef.current.requestSubmit();
        }
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!input) return;

        sendMessage();
        setInput("");

        //api call
    }

    const readMessage = async () => {
        let res = await fetch(`/api/user/messages/read`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user: myUser.username,
                otherUser: user.username
            })
        })

        res = await res.json();;
    }


    useEffect(() => {
        if (!myUser || !user) return;

        if (myUser.messages && myUser.messages[user.username]) {
            const lastMessage = myUser.messages[user.username].at(-1);
            if (lastMessage && !lastMessage.read.state && !lastMessage.me) {
                readMessage();
                mutate(`/api/user/messages?username=${myUser.username}`);
            }
        }
    }, [myUser, user])

    return (
        !matches ? (
            <div className="relative h-screen-minus-header flex flex-col">
                <div className="flex items-center py-2 px-4">
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

                <MessageBox messages={myUser?.messages && user ? myUser.messages[user?.username] : []} />
                <form ref={formRef} onSubmit={handleSubmit} className="sticky my-2 self-center w-full px-3 flex items-center space-x-2">
                    <SendMedia user={myUser?.username} otherUser={user?.username} />
                    <Textarea value={input} onChange={handleChange} onKeyDown={handleKeyDown} className="flex-1" placeholder="Enter message" autosize rightSection={<button className={`${!input && "hidden"} hover:text-primary hover:font-medium`}>Send</button>} rightSectionWidth={60} />
                </form>
            </div>
        ) : (
            <MessagesLayout>
                <div className="flex flex-col items-center h-screen-minus-header w-full max-w-2xl pt-2 px-4">
                    <div className="flex items-center space-x-2">
                        <Image src={!user?.image_url ? default_avatar : user.image_url} className="rounded-full" width={36} height={36} />
                        <NextLink href={`/u/${username}`}>
                            <h2 className="text-xl">{username}</h2>
                        </NextLink>
                    </div>
                    <MessageBox messages={myUser?.messages ? myUser.messages[user?.username] : []} />
                    <form ref={formRef} onSubmit={handleSubmit} className="mx-auto mt-auto mb-4 self-center flex items-center space-x-2 w-[95%]">
                        <SendMedia user={myUser?.username} otherUser={user?.username} />
                        <Textarea value={input} onChange={handleChange} onKeyDown={handleKeyDown} className="flex-1" placeholder="Enter message" autosize rightSection={<button className={`${!input && "hidden"} hover:text-primary hover:font-medium`}>Send</button>} rightSectionWidth={60} />
                    </form>
                </div>
            </MessagesLayout>
        )
    )
}

export default Message