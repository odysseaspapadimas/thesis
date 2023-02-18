import { ActionIcon, Button, LoadingOverlay, Popover, Rating, Tooltip, Transition } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import { useState } from "react"
import { Star, X } from "tabler-icons-react"
import { OnList } from "./AlreadyWatched"
import { User } from "../../constants/types"
import { KeyedMutator, useSWRConfig } from "swr"
import ReviewModal from "../ReviewModal"

type Props = {
    id: string
    type: string
    onList: OnList
    ratings: User["ratings"]
    username: User["username"]
    image_url: User["image_url"]
    mutate: KeyedMutator<any>
}
const Rate = ({ id, type, onList, ratings, username, image_url, mutate: mutateOnList }: Props) => {
    const { mutate } = useSWRConfig();
    const [opened, setOpened] = useState(false);
    const [modalOpened, setModalOpened] = useState(false);

    const _rating = ratings?.find(rating => rating.id === id)?.rating //fix this
    const [rating, setRating] = useState(_rating)

    const userReview = ratings?.find(rating => rating.id === id)?.review;

    const [showDelete, setShowDelete] = useState(false)

    const [loading, setLoading] = useState(false);

    console.log(onList, 'onList')

    const handleRating = async (value: number) => {
        setLoading(true);

        setRating(value);

        const res = await fetch("/api/user/rate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                rating: value,
                id,
                type,
                username
            }),
        })

        const result = await res.json();
        console.log(result, 'result');
        setLoading(false);

        if (!result.acknowledged) {
            setRating(_rating);
        }

        mutateOnList();
        mutate(`/api/user/review?id=${id}&type=${type}`)

    }

    const handleRemove = async () => {
        setRating(0);

        const res = await fetch("/api/user/rate", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id,
                type,
                username
            }),
        })

        mutateOnList();
        mutate(`/api/user/review?id=${id}&type=${type}`)

    }

    const isMobile = useMediaQuery("(max-width: 768px)", true, { getInitialValueInEffect: true });

    return (
        <>
            <Popover
                opened={opened} onChange={setOpened}
                transitionDuration={50}
                position={!isMobile ? "bottom" : "bottom-end"}
                width={230}
                withArrow
                arrowPosition="center"
                withinPortal>
                <Popover.Target>
                    <Tooltip
                        transitionDuration={50}
                        position="bottom"
                        withArrow
                        withinPortal
                        label="Rate"
                        disabled={opened}
                    >
                        <div>
                            <ActionIcon
                                variant="filled"
                                size="lg"
                                className="bg-slate-800 hover:bg-slate-900 transition-colors duration-75 rounded-full grid place-items-center p-3"
                                style={{ height: "unset", width: "unset" }}
                                onClick={() => setOpened((opened) => !opened)}
                            >
                                <Star className={onList?.on.includes("rated") ? "text-yellow-500 fill-yellow-500" : ""} />
                            </ActionIcon>
                        </div>
                    </Tooltip >
                </Popover.Target>
                <Popover.Dropdown onMouseEnter={() => setShowDelete(true)} onMouseLeave={() => setShowDelete(false)}>
                    <div className="flex flex-col items-center space-y-4">
                        <div>
                            <Transition mounted={showDelete && onList.on.includes("rated")} transition="slide-left">
                                {(styles) => (
                                    <Tooltip style={styles} label="Remove rating" className="absolute left-3 top-5" withArrow>
                                        <div>
                                            <X onClick={handleRemove} size={20} style={styles} className="cursor-pointer text-gray-400 hover:text-white" />
                                        </div>
                                    </Tooltip>
                                )}
                            </Transition>
                            <div className="relative p-1">
                                <LoadingOverlay visible={loading} loaderProps={{ size: "sm" }} radius="sm" />
                                <Rating defaultValue={_rating} value={rating} onChange={handleRating} fractions={2} size="lg" />
                            </div>
                        </div>
                        <Button className="bg-primary" onClick={() => {
                            setOpened(false);
                            setModalOpened(true)
                        }}>{onList?.on.includes("reviewed") ? "Edit your review" : "Leave a review"}</Button>
                    </div>
                </Popover.Dropdown>
            </Popover>

            <ReviewModal opened={modalOpened} setOpened={setModalOpened} id={id} type={type} username={username} image_url={image_url} mutateOnList={mutateOnList} reviewed={onList?.on.includes("reviewed")} userReview={userReview} />
        </>
    )
}
export default Rate