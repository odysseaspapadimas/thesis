import { Center, Loader, Popover, TextInput } from "@mantine/core"
import { useDebouncedValue } from "@mantine/hooks";
import { MovieResult, TvResult } from "moviedb-promise";
import { PersonResult } from "../../pages/search";
import { useState } from "react"
import useSWR from "swr";
import { Plus } from "tabler-icons-react"
import fetcher from "../../helpers/fetcher";
import Person from "./Person";
import Show from "./Show";

interface SearchMultiResponse {
    results: Array<MovieResult | TvResult | PersonResult>;
    total_results: number;
    total_pages: number;
}

type Props = {
    user: string;
    otherUser: string;
}

const SendMedia = ({ user, otherUser }: Props) => {
    const [input, setInput] = useState("");
    const [query] = useDebouncedValue(input, 400);

    const { data } = useSWR<SearchMultiResponse>(query ? `/api/search?q=${query}` : null, fetcher);

    const handleSend = async (media: MovieResult | TvResult | PersonResult) => {
        let name, image_path, media_type
        if (media.media_type === "movie") {
            name = media.title;
            image_path = media.poster_path;
        } else if (media.media_type === "tv") {
            name = media.name;
            image_path = media.poster_path;
            media_type = "show";
        } else if (media.media_type === "person") {
            name = media.name;
            image_path = media.profile_path;
        }
        let res = await fetch("/api/user/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                media_id: media.id,
                media_type: media_type ? media_type : media.media_type,
                media_name: name,
                image_path,
                user,
                otherUser
            }),
        });

        res = await res.json();

        console.log(res, 'res')
    }

    return (
        <Popover position="top-start" withArrow width={300} classNames={{ dropdown: "h-[585px]" }}>
            <Popover.Target>
                <div>
                    <Plus className="border border-white rounded-full cursor-pointer" size={28} />
                </div>
            </Popover.Target>

            <Popover.Dropdown>
                <p className="text-center mb-2">Search for media</p>
                <TextInput value={input} onChange={(e) => setInput(e.currentTarget.value)} />

                <div className="flex flex-col space-y-2 mt-2">
                    {query && !data ? (
                        <Center>
                            <Loader />
                        </Center>
                    ) : query && data && data.results.length > 0 ? data.results.slice(0, 5).map((result) => {
                        if (result.media_type === "person") {
                            return <Person onClick={handleSend} key={result.id} result={result} />;
                        } else if (result.media_type === "movie" || result.media_type === "tv") {
                            return <Show onClick={handleSend} key={result.id} result={result} />;
                        }
                    }) : query && data?.results.length === 0 && (
                        <p>No media found</p>
                    )}

                </div>

            </Popover.Dropdown>
        </Popover>
    )
}

export default SendMedia