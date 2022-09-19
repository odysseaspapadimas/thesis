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
  Drawer,
  TabsValue,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { NextLink } from "@mantine/next";
import { format } from "path";
import { FormEvent, FormEventHandler, SetStateAction, useState } from "react";
import { signIn, useSession, signOut } from "next-auth/react";
import SignInSignUp from "./SignInSignUp";
import useUser from "../hooks/use-user";
import { useMediaQuery } from "@mantine/hooks";
import Search from "./Search";
import { MenuDivider } from "@mantine/core/lib/Menu/MenuDivider/MenuDivider";

type HeaderP = {
  opened: boolean;
  setOpened: React.Dispatch<SetStateAction<boolean>>;
};

const Header = () => {
  const [opened, setOpened] = useState(false);
  const [navOpened, setNavOpened] = useState(false);
  const [activeTab, setActiveTab] = useState<TabsValue>("sign-in"); //Tab for sign-in/up modal

  const { data: session, status } = useSession();

  const { user, error } = useUser({ session, options: { refreshInterval: 1000 } });

  let unread = 0;

  for (const message in user?.messages) {
    const userMessage = user?.messages[message]?.at(-1)
    if (userMessage && !userMessage.me && !userMessage.read) {
      unread++;
    }
  }

  return (
    <>
      <MantineHeader height={70}>
        <Container size="xl" className="h-full grid ">
          <Drawer
            opened={navOpened}
            onClose={() => setNavOpened(false)}
            onClick={() => setNavOpened(false)}
            withCloseButton={false}
            closeOnClickOutside
            padding="xl"
            size="xl"
            classNames={{
              drawer: "w-[75%]",
            }}
            className=" translate-y-[70px] "
          >
            <NavLinks />
          </Drawer>

          <Group position="apart">
            <MediaQuery
              largerThan="sm"
              styles={{ display: "none" }}
              className=""
            >
              <Burger
                opened={navOpened}
                onClick={() => setNavOpened((o) => !o)}
                size="sm"
              />
            </MediaQuery>
            <NextLink href="/" className="text-2xl font-bold mx-auto">
              ZeTell
            </NextLink>

            <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
              <div className="flex-[2] ml-6">
                <NavLinks />
              </div>
            </MediaQuery>

            <Search setNavOpened={setNavOpened} />
            <Group>
              <Menu
                position="bottom-end"
                withArrow
              classNames={{item: "text-base"}}
              >
                <Menu.Target>
                  <div className="cursor-pointer">
                    <Avatar src={session?.user?.image} />
                    {unread ?
                      <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-primary"></div>
                      : null}
                  </div>
                </Menu.Target>
                <Menu.Dropdown className="-translate-x-[8px]">
                  {session ? (
                    <>
                      <Menu.Item component={NextLink} href={"/u/" + user?.username}>
                        <p className="font-semibold text-lg ">
                          {user?.username}
                        </p>
                      </Menu.Item>
                      <Divider my="xs" className="" />

                      <Menu.Item component={NextLink} href="/messages" rightSection={<Notifications num={unread} />}>
                        Messages
                      </Menu.Item>
                      <Menu.Item>Settings</Menu.Item>

                      <Divider my="xs" labelPosition="center" />
                      <Menu.Item onClick={() => signOut()}>Sign-out</Menu.Item>
                    </>
                  ) : (
                    <>
                      <Menu.Item
                        onClick={() => {
                          setOpened(true);
                          setActiveTab("sign-in");
                        }}
                      >
                        Sign-in
                      </Menu.Item>
                      <Divider />
                      <Menu.Item
                        onClick={() => {
                          setOpened(true);
                          setActiveTab("sign-up");
                        }}
                      >
                        Sign-up
                      </Menu.Item>
                    </>
                  )}
                </Menu.Dropdown>
              </Menu>
            </Group>
          </Group>
        </Container>
      </MantineHeader>

      <Modal closeOnClickOutside={true} opened={opened} onClose={() => setOpened(false)}>
        <SignInSignUp activeTab={activeTab} setActiveTab={setActiveTab} />
      </Modal>
    </>
  );
};

export default Header;

const NavLinks = () => (
  <div className="flex md:space-x-4 items-center flex-col md:flex-row space-y-4 md:space-y-0 text-xl sm:text-base">
    <NextLink href="/movies">
      <span className="text-gray-300 hover:text-white font-semibold">
        Movies
      </span>
    </NextLink>
    <NextLink href="/shows">
      <span className="text-gray-300 hover:text-white font-semibold">
        TV Shows
      </span>
    </NextLink>
  </div>
);

const Notifications = ({ num }: { num: number }) => (
  <div className="ml-6 h-5 w-5 rounded-full bg-primary grid place-items-center text-xs font-medium">{num}</div>
)