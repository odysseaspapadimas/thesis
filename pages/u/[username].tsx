import { Button, Container, Group, Loader, Tabs } from "@mantine/core/"
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
import { NextLink } from "@mantine/next";
import Reviews from "../../components/Profile/Reviews";

const profile = () => {
  const router = useRouter();

  const { list } = router.query;

  const { username } = router.query;

  const { data: session } = useSession();

  const { user, error, mutate: mutateUser } = useUser({ username: username });

  const { user: myUser } = useUser({ session })

  const reviews = user?.ratings?.filter((rating) => rating.review);

  const reviewsLength = () => {
    let count = 0;
    user?.ratings?.forEach((rating) => (rating.review && count++));
    return count;
  }

  useEffect(() => {
    if (!user && !error) return;
    if (!user && error) {
      router.push("/404");
    }
  }, [user, error]);

  const [isFollowing, setIsFollowing] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user || !myUser) return;

    setIsFollowing(user.followers ? user.followers.includes(myUser.username) : false)
  }, [user, myUser])


  const [opened, setOpened] = useState({ opened: false, tab: "followers" });

  if (!user || (!myUser && session)) {
    return <Loader size="xl" className="w-full p-auto mt-10" variant="dots" />;
  }


  //const isFollowing = user.followers?.includes(myUser.username);

  const handleToggleFollow = async () => {
    setIsLoading(true);
    console.log(isFollowing);

    const res = await fetch(
      `/api/user/toggleFollow?myUsername=${myUser.username}&username=${user.username}&isFollowing=${isFollowing}`,
      {
        method: "POST",
      }
    );

    const response = await res.json();

    console.log(response)

    if (response.acknowledged) {
      setIsLoading(false);
    }
    mutateUser();
  }


  return (
    <div>
      <Head>
        <title>{username} - Profile</title>
      </Head>
      <Container py={12}>
        <div className="flex flex-col items-center sm:flex-row">
          <Group className="self-center">
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
              <div onClick={() => setOpened({ opened: true, tab: "followers" })} className="p-2 w-[85px] flex flex-col justify-center items-center hover:bg-[#27292e] hover:cursor-pointer">
                <p>{user.followers ? user.followers.length : 0}</p>
                <p>{user.followers && user.followers.length === 1 ? "Follower" : "Followers"}</p>
              </div>
            </Group>
            <Group>
              <div onClick={() => setOpened({ opened: true, tab: "following" })} className="p-2 w-[85px] flex flex-col justify-center items-center hover:bg-[#27292e] hover:cursor-pointer">
                <p>{user.following ? user.following.length : 0}</p>
                <p>Following</p>
              </div>
            </Group>

            <FollowersFollowing username={String(username)} followers={user.followers} following={user.following} opened={opened} setOpened={setOpened} />
          </Group>
          {myUser && user.username !== myUser.username &&
            <div className="flex items-center space-x-3">
              <Button onClick={handleToggleFollow} loading={isLoading} loaderPosition="center" w={100} className={`${!isFollowing ? 'bg-primary' : 'bg-dark hover:bg-dark-hover'} my-4 sm:my-0`}>{!isFollowing ? 'Follow' : 'Unfollow'}</Button>
              <NextLink href={`/messages/${user.username}`}>
                <Button w={100} className="bg-dark hover:bg-dark-hover">Message</Button>
              </NextLink>
            </div>
          }
        </div>

        <Tabs
          mt={24}
          styles={{}}
          classNames={{
            tabsList: "",
            tabLabel: "mb-1 sm:text-lg leading-[18px]",
          }}
          defaultValue={list ? String(list) : "watched"}
          onTabChange={(tab) => router.replace(`/u/${user.username}?list=${tab}`)}
        >
          <Tabs.List grow position="center" className="flex justify-center w-full items-center flex-nowrap">
            <Tabs.Tab value="watched"><TabLabel text="Already Watched" length={user.watched?.length} /></Tabs.Tab>
            <Tabs.Tab value="plan"><TabLabel text="Plan to Watch" length={user.plan_to?.length} /></Tabs.Tab>
            <Tabs.Tab value="favorites"><TabLabel text="Favorites" length={user.favorites?.length} /></Tabs.Tab>
            <Tabs.Tab value="reviews"><TabLabel text="Reviews" length={reviewsLength()} /></Tabs.Tab>
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
          <Tabs.Panel value="reviews">
            <Reviews username={String(username)} reviews={reviews} />
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
    <p className="text-[12px] sm:text-base">{text}</p>
  );
};
