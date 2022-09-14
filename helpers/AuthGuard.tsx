import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { NextPage } from "next";
import { Loader } from "@mantine/core";

export default function AuthGuard({ children }: { children: JSX.Element }) {
  const router = useRouter();
  console.log('hello')
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      // The user is not authenticated, handle it here.
      router.push("/"); //add ?signin
    },
  });

  const loading = status === "loading";

  /* show loading indicator while the auth provider is still loading */
  if (loading) {
    return (
      <Loader size="xl" className="w-full p-auto mt-10" variant="dots" />
    );
  }

  // if auth initialized with a valid user show protected page
  if (!loading && session) {
    return <>{children}</>;
  }

  /* otherwise don't return anything, will do a redirect from useEffect */
  return null;
}
