import { ActionIcon, Container, Group, Modal, TextInput, Tooltip } from "@mantine/core"
import { NextLink } from "@mantine/next"
import { useSession } from "next-auth/react"
import { ReactElement, useState } from "react"
import useSWR from "swr"
import { Edit } from "tabler-icons-react"
import fetcher from "../../helpers/fetcher"
import useUser from "../../hooks/use-user"
import User from "../Messages/User"
import UserToSend from "../Messages/UserToSend"

const MessagesLayout = ({ children }: { children: ReactElement }) => {

    const { data: session } = useSession();

    const { user } = useUser(({ session }))

    const { data } = useSWR(user && user.username ? `/api/user/messages?username=${user.username}` : null, fetcher)

    const [showModal, setShowModal] = useState(false);

    //  console.log(data, 'data');
    return (
        <Container size="xl" className="flex flex-col md:flex-row md:justify-center">
            <div className="w-full md:max-w-xs">
                <div className="flex items-center justify-between w-full">
                    <h1>Messages</h1>
                    <Tooltip label="Send a new message" classNames={{ body: "bg-dark text-white" }}>
                        <Edit onClick={() => setShowModal(true)} className="hover:bg-dark rounded-md p-1 cursor-pointer" size={32} />
                    </Tooltip>
                    <Modal
                        opened={showModal}
                        onClose={() => setShowModal(false)}
                        title="Send a new message"
                    >
                        <TextInput placeholder="Search for a user" />
                        <div className="flex flex-col space-y-2 my-2">
                            {user && user.following?.map((username) => (
                                <UserToSend key={username} onClick={() => setShowModal(false)} username={username} />
                            ))}
                        </div>
                    </Modal>
                </div>
                <div className="flex flex-col space-y-2 max-h-message-list overflow-y-auto">
                    {data && Object.keys(data).sort((a, b) => {
                        const date1 = new Date(data[a].at(-1).sent).valueOf();
                        const date2 = new Date(data[b].at(-1).sent).valueOf();

                        console.log(date1, date2, 'date');
                        return date2 - date1
                    }).map((username) => (
                        <User key={username} username={username} lastMessage={data[username].at(-1)} />
                    ))}
                </div>
            </div>
            {children}
        </Container>
    )
}

export default MessagesLayout