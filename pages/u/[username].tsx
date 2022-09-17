import { Button, Container, Group, Loader, Tabs } from "@mantine/core";
import { NextLink } from "@mantine/next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSWRConfig } from "swr";
import AlreadyWatched from "../../components/Profile/AlreadyWatched";
import Favorites from "../../components/Profile/Favorites";
import FollowersFollowing from "../../components/Profile/FollowersFollowing";
import PlanToWatch from "../../components/Profile/PlanToWatch";
import { User } from "../../constants/types";
import useUser from "../../hooks/use-user";

const profile = () => {
  const router = useRouter();

  const { username } = router.query;

  const { data: session } = useSession();

  const { user, error, mutate: mutateUser } = useUser({ username: username });

  const { user: myUser } = useUser({ session })

  console.log(user, 'user', error, 'error ');

  useEffect(() => {
    if (!user && !error) return;
    if (!user && error) {
      router.push("/404");
    }
  }, [user, error]);

  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (!user || !myUser) return;

    setIsFollowing(user.followers ? user.followers.includes(myUser.username) : false)
  }, [user, myUser])


  const [opened, setOpened] = useState({ opened: false, tab: 0 });

  if (!user || !myUser) {
    return <Loader size="xl" className="w-full p-auto mt-10" variant="dots" />;
  }


  //const isFollowing = user.followers?.includes(myUser.username);

  const handleToggleFollow = async () => {
    console.log(isFollowing);

    const res = await fetch(
      `/api/user/toggleFollow?myUsername=${myUser.username}&username=${user.username}&isFollowing=${isFollowing}`,
      {
        method: "POST",
      }
    );

    const response = await res.json();

    console.log(response)

    mutateUser();
  }


  return (
    <div>
      <Head>
        <title>{username} - Profile</title>
      </Head>
      <Container size="xl" py={12}>
        <div className="flex flex-col items-center sm:flex-row">
          <Group className="self-start">
            <Image
              src={user.image_url}
              width={100}
              height={100}
              className="rounded-full"
            />
            <h1>{user.username}</h1>
          </Group>
          <Group className="space-x-4 mx-8">
            <Group>
              <div onClick={() => setOpened({ opened: true, tab: 0 })} className="p-2 flex flex-col items-center hover:bg-[#27292e] hover:cursor-pointer">
                <p>{user.followers ? user.followers.length : 0}</p>
                <p>Followers</p>
              </div>
            </Group>
            <Group>
              <div onClick={() => setOpened({ opened: true, tab: 1 })} className="p-2 flex flex-col items-center hover:bg-[#27292e] hover:cursor-pointer">
                <p>{user.following ? user.following.length : 0}</p>
                <p>Following</p>
              </div>
            </Group>

            <FollowersFollowing username={String(username)} followers={user.followers} following={user.following} opened={opened} setOpened={setOpened} />
          </Group>
          {user.username !== myUser.username &&
            <div className="flex items-center space-x-3">
              <Button onClick={handleToggleFollow} className={`${!isFollowing ? 'bg-primary' : 'bg-dark hover:bg-dark-hover'} my-4 sm:my-0`}>{!isFollowing ? 'Follow' : 'Unfollow'}</Button>
              <NextLink href={`/messages/${user.username}`}>
                <Button className="bg-dark hover:bg-dark-hover">Message</Button>
              </NextLink>
            </div>
          }
        </div>

        <Tabs
          mt={24}
          styles={{}}
          classNames={{
            tabsList: "",
            tab: "min-w-[120px]",
            tabLabel: "mb-1 sm:text-lg leading-[18px]",
          }}
          defaultValue="watched"
        >
          <Tabs.List grow position="center" className="flex justify-center w-full items-center flex-nowrap">
            <Tabs.Tab value="watched"><TabLabel text="Already Watched" length={user.watched?.length} /></Tabs.Tab>
            <Tabs.Tab value="plan"><TabLabel text="Plan To Watch" length={user.plan_to?.length} /></Tabs.Tab>
            <Tabs.Tab value="favorites"><TabLabel text="Favorites" length={user.favorites?.length} /></Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="watched">
            <AlreadyWatched username={String(username)} />
          </Tabs.Panel>
          <Tabs.Panel value="plan">
            <PlanToWatch username={String(username)} />
          </Tabs.Panel>
          <Tabs.Panel value="favorites">
            <Favorites username={String(username)} />
          </Tabs.Panel>
        </Tabs>
      </Container>
    </div>
  );
};
export default profile;

type TabLabelProps = {
  text: string;
  length: number | undefined;
};

const TabLabel = ({ text, length }: TabLabelProps) => {
  return (
    <div className="flex flex-col sm:flex-row whitespace-nowrap items-center sm:space-x-2">
      <p>{text}</p>
      <div className="bg-primary rounded-full grid place-items-center h-6 w-6 text-xs text-white">
        {length ? length : 0}
      </div>
    </div>
  );
};
