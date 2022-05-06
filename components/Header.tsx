import {
  Header as MantineHeader,
  Burger,
  MediaQuery,
  Container,
  Button,
  Modal,
  TextInput,
  PasswordInput,
  Text,
  Avatar,
  Menu,
  Divider,
  Group,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { NextLink } from "@mantine/next";
import { format } from "path";
import { FormEvent, FormEventHandler, SetStateAction, useState } from "react";
import { signIn, useSession, signOut } from "next-auth/react";
import SignInSignUp from "./SignInSignUp";
import useUser from "../hooks/use-user";

type HeaderP = {
  opened: boolean;
  setOpened: React.Dispatch<SetStateAction<boolean>>;
};

const Header = () => {
  const [opened, setOpened] = useState(false);
  const [activeTab, setActiveTab] = useState(1); //Tab for sign-in/up modal

  const { data: session, status } = useSession();

  const { user, error } = useUser({ session });

  return (
    <>
      <MantineHeader height={70}>
        <Container size="xl" className="flex justify-between items-center h-full">
          <NextLink href="/" className="text-2xl font-bold">
            ZeTell
          </NextLink>

          <ul className="flex items-center space-x-4 text-lg ml-8">
            <li>
              <NextLink
                href="/about"
                className="hover:-translate-y-2 transition-all hover:text-white"
              >
                <Button>About</Button>
              </NextLink>
            </li>
          </ul>

          {status === "loading" ? (
            <></>
          ) : !session ? (
            <Group>
              <Button
                onClick={() => {
                  setOpened(true);
                  setActiveTab(0);
                }}
                className="bg-primary"
              >
                Sign-in
              </Button>
              <Button
                onClick={() => {
                  setOpened(true);
                  setActiveTab(1);
                }}
                className="bg-primary"
              >
                Sign-up
              </Button>
            </Group>
          ) : (
            <>
              <Menu
                control={<Avatar src={session.user?.image} />}
                size="sm"
                placement="center"
                withArrow
              >
                <NextLink href={"/u/" + user?.username}>
                  <Menu.Item>
                    <p className="font-semibold text-lg">{user?.username}</p>
                  </Menu.Item>
                </NextLink>
                <Divider className="border-t-gray-500" />

                <Menu.Item>Settings</Menu.Item>

                <Divider my="xs" labelPosition="center" />
                <Menu.Item onClick={() => signOut()}>Sign-out</Menu.Item>
              </Menu>
            </>
          )}
        </Container>
      </MantineHeader>

      <Modal opened={opened} onClose={() => setOpened(false)}>
        <SignInSignUp activeTab={activeTab} setActiveTab={setActiveTab} />
      </Modal>
    </>
  );
};

export default Header;
