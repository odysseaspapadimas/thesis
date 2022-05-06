import { Button, Container, Loader, Modal, TextInput } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useState } from "react";
import useSWR from "swr";
import Header from "../components/Header";
import SignupModal from "../components/Home/SignupModal";
import TrendingMovies from "../components/Home/TrendingMovies";
import fetcher from "../helpers/fetcher";
import useUser from "../hooks/use-user";
import { NextPageWithAuth } from "./_app";

const Home: NextPageWithAuth = () => {
  const { data: session } = useSession();

  const { data, error } = useSWR(
    session ? `/api/user/userExists?email=${session.user?.email}` : null,
    fetcher
  );

  const { user, error: userError } = useUser({ session });

  if (!data && !error) {
    return <Loader size="xl" className="w-full p-auto mt-10" variant="dots" />;
  }

  if (!data.userExists) {
    console.log("user doesn't exist open modal");
  }

  if (!data.userExists) {
    return <div>{session && <SignupModal session={session} />}</div>;
  }

  return (
    <div>
      <Container className="grid place-items-center py-10">
        <h1>Welcome, {user?.username}</h1>
        <br />
        <h2 className="font-semibold text-xl mb-6">
          Check out the movies trending right now
        </h2>

        <TrendingMovies />
      </Container>
    </div>
  );
};

Home.requireAuth = true;

export default Home;
