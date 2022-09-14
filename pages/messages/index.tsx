import { Container, MediaQuery, Text } from "@mantine/core";
import { NextLink } from "@mantine/next";
import { ReactElement } from "react";
import MessagesLayout from "../../components/Layouts/MessagesLayout";
import { NextPageWithAuth } from "../_app"

const Messages: NextPageWithAuth = () => {
    return (
        <MessagesLayout>
            <MediaQuery query="(max-width: 900px)" styles={{display: 'none'}}>
            <div className="py-4 text-center text-2xl w-full max-w-2xl mt-2">
                <Text size="xl">Select a chat</Text>
            </div>
        </MediaQuery>
        </MessagesLayout >
    )
}

export default Messages

Messages.requireAuth = true;
