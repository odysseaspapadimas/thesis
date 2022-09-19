import { Modal, Tabs } from "@mantine/core";
import { Dispatch, SetStateAction, useState } from "react";
import useSWR from "swr";
import fetcher from "../../helpers/fetcher";
import User from "./User";

export type State = {
    tab: string;
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
                value={opened.tab}
                onTabChange={(tab) => setOpened({ ...opened, tab: String(tab) })}
                classNames={{
                    tabLabel: "mb-1 sm:text-lg leading-[18px]",
                }}
            >
                <Tabs.List position="center"
                    grow>
                    <Tabs.Tab value="followers">Followers</Tabs.Tab>
                    <Tabs.Tab value="following">Following</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="followers">
                    <div className="flex flex-col space-y-3">
                        {followers?.map((user: TUser) => (
                            <User key={user.username} data={user} setOpened={setOpened} />
                        ))}
                    </div>
                </Tabs.Panel>
                <Tabs.Panel value="following">
                    <div className="flex flex-col space-y-3">
                        {following?.map((user: TUser) => (
                            <User key={user.username} data={user} setOpened={setOpened} />
                        ))}
                    </div>
                </Tabs.Panel>
            </Tabs>
        </Modal>

    )
}

export default FollowersFollowing