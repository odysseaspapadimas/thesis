import { Container, Group, Loader, Tabs } from "@mantine/core";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";
import AlreadyWatched from "../../components/Profile/AlreadyWatched";
import Favorites from "../../components/Profile/Favorites";
import PlanToWatch from "../../components/Profile/PlanToWatch";
import useUser from "../../hooks/use-user";

type ListItem = {
  id: string;
  type: "movie" | "show"
}

export type User = {
  username: string;
  email: string;
  image_url: string;
  created_at: string;
  watched: [ListItem];
  plan_to: [ListItem];
  favorites: [ListItem];
};

const profile = () => {
  const router = useRouter();

  const { username } = router.query;


  const { user, error } = useUser({ username: username }) as {
    user: User;
    error: string;
  };

  console.log(user, 'user', error, 'error ');

  useEffect(() => {
    if (!user && !error) return;
    if (!user && error) {
      router.push("/404");
    }
  }, [user, error]);

  if (!user) {
    return <Loader size="xl" className="w-full p-auto mt-10" variant="dots" />;
  }

  return (
    <div>
      <Head>
        <title>{username} - Profile</title>
      </Head>
      <Container size="xl" py={12}>
        <Group>
          <Image
            src={user.image_url}
            width={100}
            height={100}
            className="rounded-full"
          />
          <h1>{user.username}</h1>
        </Group>

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
