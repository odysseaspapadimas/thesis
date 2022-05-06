import { Container, Group, Loader, Tabs } from "@mantine/core";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";
import PlanToWatch from "../../components/Profile/PlanToWatch";
import useUser from "../../hooks/use-user";

export type User = {
  username: string;
  email: string;
  image_url: string;
  created_at: string;
};

const profile = () => {
  const router = useRouter();

  const { username } = router.query;

  if (!username) return <></>;

  const { user, error } = useUser({ username: String(username) }) as {
    user: User;
    error: string;
  };

  useEffect(() => {
    if (!user) return;
    if (!user.username && !error) {
      router.push("/404");
    }
  }, [user]);

  if (!user) {
    return <Loader size="xl" className="w-full p-auto mt-10" variant="dots" />;
  }

  return (
    <div>
      <Container py={12}>
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
          styles={(theme) => ({
            tabControl: {
              fontSize: "1.25rem",
            },
          })}
        >
          <Tabs.Tab label="Already Watched">Already Watched</Tabs.Tab>
          <Tabs.Tab label="Plan to Watch">
            <PlanToWatch />
          </Tabs.Tab>
          <Tabs.Tab label="Favorites">Favorites</Tabs.Tab>
        </Tabs>
      </Container>
    </div>
  );
};
export default profile;
