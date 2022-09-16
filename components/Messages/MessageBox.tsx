import { Button, ScrollArea, TextInput, Tooltip } from "@mantine/core"
import dayjs from "dayjs";
import { MutableRefObject, useEffect, useRef } from "react"
import { useSWRConfig } from "swr";
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
        ref.current.scrollTo({ top: ref.current.scrollHeight, behavior: "smooth" });
    }, [messages])

    return (
        <div ref={ref} className="overflow-y-auto w-full scrollbar" style={{ height: 'calc(100vh - 168px)' }}>
            {groupedMessages && groupedMessages.map((messageObj: Group) => (
                <div key={messageObj.date} className="flex flex-col w-full mx-auto py-2 pr-1 pl-[13px] space-y-2" >
                    <p className="self-center text-sm text-gray-400 mb-4">{dayjs(messageObj.date).format("DD MMM YYYY")}</p>
                    {messageObj.messages && messageObj.messages.map((message) => (
                        <Tooltip
                            key={String(message.sent)}
                            label={dayjs(message.sent).format("HH:mm")}
                            allowPointerEvents
                            position={`${message.me ? "left" : "right"}`}
                            className={`${message.me ? "self-end bg-primary border border-primary" : "self-start bg-dark border border-dark"} rounded-md px-4 py-2 max-w-[75%]`}
                            classNames={{ body: "bg-dark text-white text-sm py-2" }}>
                            <p className="break-all">{message.text} </p>
                        </Tooltip>
                    ))}
                </div>
            ))}

        </div>
    )
}

export default MessageBox