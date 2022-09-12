import { Button, Container, Group, Loader, Tabs } from "@mantine/core";
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
            <Button onClick={handleToggleFollow} className={`${!isFollowing ? 'bg-primary' : 'bg-gray-700 hover:bg-gray-800'} my-4 sm:my-0`}>{!isFollowing ? 'Follow' : 'Unfollow'}</Button>
          }
        </div>

        <Tabs
          position="center"
          grow
          tabPadding="lg"
          mt={24}
          classNames={{
            tabLabel: "mb-1 sm:text-lg leading-[18px]",
          }}
        >
          <Tabs.Tab label="Already Watched">
            <AlreadyWatched username={String(username)} />
          </Tabs.Tab>
          <Tabs.Tab label="Plan to Watch">
            <PlanToWatch username={String(username)} />
          </Tabs.Tab>
          <Tabs.Tab label="Favorites">
            <Favorites username={String(username)} />
          </Tabs.Tab>
        </Tabs>
      </Container>
    </div>
  );
};
export default profile;
