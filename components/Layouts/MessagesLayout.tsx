import { Container } from "@mantine/core"
import { NextLink } from "@mantine/next"
import { useSession } from "next-auth/react"
import { ReactElement } from "react"
import useSWR from "swr"
import fetcher from "../../helpers/fetcher"
import useUser from "../../hooks/use-user"
import User from "../Messages/User"

const MessagesLayout = ({ children }: { children: ReactElement }) => {

    const { data: session } = useSession();

    const { user } = useUser(({ session }))

    const { data } = useSWR(user && user.username ? `/api/user/messages?username=${user.username}` : null, fetcher)

    //  console.log(data, 'data');
    return (
        <Container size="xl" className="flex flex-col md:flex-row md:justify-center ">
            <div className="w-full max-w-xs">
                <h1>Messages</h1>
                <div className="flex flex-col space-y-2 max-h-message-list overflow-y-auto">
                    {data && Object.keys(data).map((username) => {
                        console.log(data[username], username, 'data')
                        return <User key={username} username={username} lastMessage={data[username].at(-1)} />
                    })}
                </div>
            </div>
            {children}
        </Container>
    )
}

export default MessagesLayout