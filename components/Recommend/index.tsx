import { Button, Center, Loader, Modal, TextInput } from "@mantine/core"
import { useDebouncedValue, useDisclosure } from "@mantine/hooks"
import { useState } from "react"
import useSWR from "swr"
import { MovieType, TVShowType, User as UserType } from "../../constants/types"
import fetcher from "../../helpers/fetcher"
import User from "./User"

type Props = {
    user: string;
    users: UserType["messages"]
    movie?: MovieType
    show?: TVShowType
}
const Recommend = ({ user, users, movie, show }: Props) => {

    const [opened, setOpened] = useDisclosure(false);

    const [query, setQuery] = useState("");
    const [debouncedQuery] = useDebouncedValue(query, 500);

    const { data: queryResults } = useSWR<UserType[]>(debouncedQuery ? `/api/user/search?query=${debouncedQuery}` : null, fetcher);

    const recommend = async (otherUser: string) => {

        const media_id = movie ? movie.id : show?.id;
        const media_type = movie ? "movie" : "show"
        const media_name = movie ? movie.title : show?.name;
        const image_path = movie ? movie.poster_path : show?.poster_path;

        const res = await fetch("/api/user/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                media_id,
                media_type,
                media_name,
                image_path,
                user,
                otherUser
            }),
        });

        const response = await res.json();

        if (response.successfull) {
            return true;
        }

        return false;

    }
    return (
        <>
            <Button onClick={setOpened.open} className="bg-primary self-center">Recommend This</Button>
            <Modal
                opened={opened}
                withCloseButton
                closeOnClickOutside
                closeOnEscape
                onClose={setOpened.close}
            >
                <h2 className="text-xl font-semibold">Select a user</h2>
                <TextInput data-autofocus value={query} onChange={(e) => setQuery(e.currentTarget.value)} placeholder="Search for a user" />
                <div className="flex flex-col space-y-2 my-2">
                    {debouncedQuery && queryResults && queryResults.length > 0 ? queryResults.map((user) => (
                        <User onClick={recommend} username={user.username} />
                    )) : debouncedQuery && !queryResults ? (
                        <Center>
                            <Loader />
                        </Center>
                    ) : debouncedQuery && queryResults?.length === 0 ? (
                        <p>No user found with that username</p>
                    ) : (
                        users && Object.keys(users).map((user) => (
                            <User onClick={recommend} username={user} />
                        ))
                    )}
                </div>

            </Modal>
        </>
    )
}
export default Recommend