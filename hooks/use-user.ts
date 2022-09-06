import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import fetcher from "../helpers/fetcher";
import { User } from "../pages/u/[username]";

type Props = {
  session?: Session | null;
  username?: string | string[] | undefined;
};

const useUser = ({
  session,
  username,
}: Props): { user: User; error: string } => {
  if (session) {
    const { data, error } = useSWR(
      session ? "/api/user?email=" + session.user?.email : null,
      fetcher
    );

    return { user: data?.user, error: data?.error };
  } else {
    const { data, error } = useSWR(
      username ? "/api/user?username=" + username : null,
      fetcher
    );

    return { user: data?.user, error: data?.error };
  }
};

export default useUser;
