import { Button, Container, Loader, Modal, TextInput } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useState } from "react";
import useSWR from "swr";
import Header from "../components/Header";
import SignupModal from "../components/Home/SignupModal";
import TrendingMovies from "../components/Home/TrendingMovies";
import TrendingShows from "../components/Home/TrendingShows";
import fetcher from "../helpers/fetcher";
import useUser from "../hooks/use-user";
import { NextPageWithAuth } from "./_app";

const Home: NextPageWithAuth = () => {
  const { data: session } = useSession();

  const { data, error } = useSWR(
    session ? `/api/user/userExists?email=${session.user?.email}` : null,
    fetcher
  );

  return (
    <Container size="xl" className="py-10">
      {data && !data.userExists && (
        <div>{session && <SignupModal session={session} />}</div>
      )}
      <TrendingMovies />
      <br />
      <TrendingShows />
    </Container>
  );
};

Home.requireAuth = true;

export default Home;
