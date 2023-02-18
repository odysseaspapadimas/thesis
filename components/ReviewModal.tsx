import { Button, Modal, Textarea } from "@mantine/core"
import { SetStateAction, useRef, useState } from "react"
import { KeyedMutator, useSWRConfig } from "swr"

type Props = {
    opened: boolean
    setOpened: React.Dispatch<SetStateAction<boolean>>
    id: string
    type: string
    username: string
    image_url: string
    mutateOnList: KeyedMutator<any>
    reviewed: boolean
    userReview: string | undefined
}
const ReviewModal = ({ opened, setOpened, id, type, username, image_url, mutateOnList, reviewed, userReview }: Props) => {

    const textRef = useRef<HTMLTextAreaElement>(null)

    const [loading, setLoading] = useState(false);

    const { mutate } = useSWRConfig()


    const handleSubmit = async () => {
        setLoading(true);
        const review = textRef.current?.value;

        if (!review) return;

        const res = await fetch("/api/user/review", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                review,
                id,
                type,
                username,
                image_url
            }),
        })

        const response = await res.json();

        console.log(response, 'reviews')

        setLoading(false);

        setOpened(false);

        mutateOnList();
        mutate(`/api/user/review?id=${id}&type=${type}`)
    }

    return (
        <Modal
            opened={opened}
            onClose={() => setOpened(false)}
            title={reviewed ? "Edit your review" : "Leave a review"}>
            <div className="flex flex-col space-y-4 items-center">
                <Textarea ref={textRef} defaultValue={reviewed ? userReview : ""} className="self-stretch" placeholder="Type your review..." />

                <Button onClick={handleSubmit} className="bg-primary" loading={loading} loaderPosition="center">Submit</Button>
            </div>
        </Modal>
    )
}
export default ReviewModal