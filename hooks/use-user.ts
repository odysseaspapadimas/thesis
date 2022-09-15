import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import useSWR, { KeyedMutator } from "swr";
import fetcher from "../helpers/fetcher";
import { User } from "../constants/types";

type Props = {
  session?: Session | null;
  username?: string | string[] | undefined;
  options?: any;
};

const useUser = ({
  session,
  username,
  options,
}: Props): { user: User; error: string; mutate: KeyedMutator<any> } => {
  if (session) {
    const { data, error, mutate } = useSWR(
      session ? "/api/user?email=" + session.user?.email : null,
      fetcher,
      options && options
    );

    return { user: data?.user, error: data?.error, mutate };
  } else {
    const { data, error, mutate } = useSWR(
      username ? "/api/user?username=" + username : null,
      fetcher,
      options && options
    );

    return { user: data?.user, error: data?.error, mutate };
  }
};

export default useUser;
