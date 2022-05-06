import { Container } from "@mantine/core";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useSWR from "swr";
import Header from "../components/Header";

const Landing: NextPage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) return;

    router.replace("/home");
  }, [session, router]);

  return (
    <div>
      <Head>
        <title>Zetv</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </div>
  );
};

export default Landing;
