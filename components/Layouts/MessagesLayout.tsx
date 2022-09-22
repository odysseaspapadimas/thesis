import { ActionIcon, Center, Container, Group, Loader, Modal, TextInput, Tooltip } from "@mantine/core"
import { useDebouncedValue } from "@mantine/hooks"
import { NextLink } from "@mantine/next"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { ChangeEvent, ReactElement, useEffect, useState } from "react"
import useSWR from "swr"
import { Edit } from "tabler-icons-react"
import { User as IUser } from "../../constants/types"
import fetcher from "../../helpers/fetcher"
import useUser from "../../hooks/use-user"
import User from "../Messages/User"
import UserToSend from "../Messages/UserToSend"

const MessagesLayout = ({ children }: { children: ReactElement }) => {

    const { data: session } = useSession();

    const { user } = useUser(({ session }))

    //const { data } = useSWR(user && user.username ? `/api/user/messages?username=${user.username}` : null, fetcher)

    const [showModal, setShowModal] = useState(false);

    const [query, setQuery] = useState("");
    const [debouncedQuery] = useDebouncedValue(query, 500);

    const { data: queryResults } = useSWR<IUser[]>(debouncedQuery ? `/api/user/search?query=${debouncedQuery}` : null, fetcher);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setQuery(e.currentTarget.value)
    }

    return (
        <Container size="xl" className="flex flex-col md:flex-row md:justify-center">
            <div className="w-full md:max-w-xs">
                <div className="flex items-center justify-between w-full">
                    <h1>Messages</h1>
                    <Tooltip label="Send a new message" classNames={{ tooltip: "bg-dark text-white" }}>
                        <Edit onClick={() => setShowModal(true)} className="hover:bg-dark rounded-md p-1 cursor-pointer" size={32} />
                    </Tooltip>
                    <Modal
                        opened={showModal}
                        onClose={() => setShowModal(false)}
                        title="Send a new message"
                    >
                        <TextInput value={query} onChange={handleChange} placeholder="Search for a user" />
                        <div className="flex flex-col space-y-2 my-2">
                            {debouncedQuery && queryResults && queryResults.length > 0 ? queryResults.map((user) => (
                                <NextLink key={user.username} href={`/messages/${user.username}`} className="flex items-center hover:bg-dark px-2 py-2 rounded-md">
                                    <Image src={user.image_url} className="rounded-full" width={40} height={40} />
                                    <p className="font-semibold hover:text-gray-200 ml-3">{user.username}</p>
                                </NextLink>
                            )) : debouncedQuery && !queryResults ? (
                                <Center>
                                    <Loader />
                                </Center>
                            ) : debouncedQuery && queryResults?.length === 0 && (
                                <p>No user found with that username</p>
                            )}
                        </div>

                        <h2 className="mt-4 border-b-2 pb-1 w-fit mx-auto text-medium text-2xl">Suggested</h2>
                        <div className="flex flex-col space-y-2 my-2">
                            {user && user.following?.map((username) => (
                                <UserToSend key={username} onClick={() => setShowModal(false)} username={username} />
                            ))}
                        </div>
                    </Modal>
                </div>
                <div className="flex flex-col space-y-2 max-h-message-list overflow-y-auto">
                    {user && user.messages && Object.keys(user.messages).length > 0 && Object.keys(user.messages).sort((a, b) => {
                        if (user.messages) {
                            const date1 = new Date(user.messages[a][user.messages[a].length - 1].sent).valueOf();
                            const date2 = new Date(user.messages[b][user.messages[b].length - 1].sent).valueOf();
                            return date2 - date1
                        } else {
                            return 0;
                        }
                    }).map((username) => (
                        user.messages && (
                            <User key={username} username={username} lastMessage={user.messages[username][user.messages[username].length - 1]} />
                        )

                    ))}
                </div>
            </div>
            {children}
        </Container>
    )
}

export default MessagesLayout