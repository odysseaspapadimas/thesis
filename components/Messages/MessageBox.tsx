import { Button, ScrollArea, TextInput, Tooltip } from "@mantine/core"
import { NextLink } from "@mantine/next";
import dayjs from "dayjs";
import Image from "next/image";
import { MutableRefObject, useEffect, useRef } from "react"
import { useSWRConfig } from "swr";
import { IMG_URL } from "../../constants/tmdbUrls";
import { Message } from "../../constants/types";
const relativeTime = require('dayjs/plugin/relativeTime')

type Group = {
    date: string;
    messages: Message[]
}

const MessageBox = ({ messages }: { messages: Message[] }) => {
    const ref = useRef() as MutableRefObject<HTMLDivElement>;

    dayjs.extend(relativeTime)

    const groups = messages?.reduce((groups: any, message: Message) => {
        const date = String(message.sent).split('T')[0];
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(message);
        return groups;
    }, {});

    // Edit: to add it in the array format instead
    const groupedMessages = groups && Object.keys(groups).map((date) => {
        return {
            date,
            messages: groups[date]
        };
    });


    useEffect(() => {
        //ref.current.scrollTo({ top: ref.current.scrollHeight, behavior: "smooth" });
        if (!ref.current || !groupedMessages || !messages) return;
        ref.current.scrollIntoView({ behavior: "smooth" })
    }, [groupedMessages, ref, messages])

    return (
        <div className="overflow-y-auto w-full scrollbar" style={{ height: 'calc(100vh - 168px)' }}>
            {groupedMessages && groupedMessages.map((messageObj: Group) => (
                <div key={messageObj.date} className="flex flex-col w-full mx-auto py-2 pr-1 pl-[13px]" >
                    <p className="self-center text-sm text-gray-400 mb-4">{dayjs(messageObj.date).format("DD MMM YYYY")}</p>
                    {messageObj.messages && messageObj.messages.map((message) => (
                        <Tooltip
                            key={String(message.sent)}
                            withArrow
                            label={dayjs(message.sent).format("HH:mm")}
                            events={{ hover: true, focus: true, touch: true }}
                            position={`${message.me ? "left" : "right"}`}
                            classNames={{ tooltip: "bg-dark text-white text-sm py-2" }}>
                            {message.text ?
                                <p className={`${message.me ? "self-end bg-primary border border-primary" : "self-start bg-dark border border-dark"} rounded-md px-4 py-2 my-1 max-w-[75%] break-all`}>{message.text} </p>
                                : message.media_type && (
                                    <div className={`${message.me ? "self-end bg-primary border border-primary" : "self-start bg-dark border border-dark"} my-1 rounded-md max-w-[75%] `}>
                                        <NextLink href={`/${message.media_type}/${message.media_id}`} className="flex flex-col items-center space-y-1 text-center p-3">
                                            {message.image_path ?
                                                <Image width={100} height={150} src={IMG_URL(message.image_path)} />
                                                : (
                                                    <div className="w-[100px] h-[150px] bg-slate-700 border"></div>
                                                )}
                                            <p>{message.media_name}</p>
                                        </NextLink>
                                    </div>
                                )}
                        </Tooltip>
                    ))}
                </div>
            ))}
            <span ref={ref}></span>
        </div>
    )
}

export default MessageBox