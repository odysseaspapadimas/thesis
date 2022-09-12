import { Modal, Tabs } from "@mantine/core";
import { Dispatch, SetStateAction, useState } from "react";
import useSWR from "swr";
import fetcher from "../../helpers/fetcher";
import User from "./User";

export type State = {
    tab: number;
    opened: boolean;
}

export type TUser = {
    username: string;
    image_url: string;
}

interface Props {
    username: string;
    followers?: string[] | undefined;
    following?: string[] | undefined;
    opened: State;
    setOpened: Dispatch<SetStateAction<State>>
}

const FollowersFollowing = ({ username, opened, setOpened }: Props) => {

    const { data: followers } = useSWR(`/api/user/followers?username=${username}`, fetcher);
    const { data: following } = useSWR(`/api/user/following?username=${username}`, fetcher);

    return (
        <Modal
            opened={opened.opened}
            onClose={() => setOpened({ ...opened, opened: false })}
        >
            {/* Modal content */}
            <Tabs
                position="center"
                grow
                active={opened.tab}
                onTabChange={(tab) => setOpened({ ...opened, tab })}
                tabPadding="lg"
                classNames={{
                    tabLabel: "mb-1 sm:text-lg leading-[18px]",
                }}
            >
                <Tabs.Tab label={"Followers"} value={0}>
                    <div className="flex flex-col space-y-3">
                        {followers?.map((user: TUser) => (
                            <User key={user.username} data={user} setOpened={setOpened} />
                        ))}
                    </div>
                </Tabs.Tab>
                <Tabs.Tab label={"Following"} value={1}>
                    <div className="flex flex-col space-y-3">
                        {following?.map((user: TUser) => (
                            <User key={user.username} data={user} setOpened={setOpened} />
                        ))}
                    </div>
                </Tabs.Tab>
            </Tabs>
        </Modal>

    )
}

export default FollowersFollowing