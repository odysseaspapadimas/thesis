import { ShowSummary_Full } from "better-trakt";

if (!process.env.NEXT_PUBLIC_TRAKT_CLIENT_ID)
  throw Error("TRAKT_CLIENT_ID environment variable is not set");

const apiKey = process.env.NEXT_PUBLIC_TRAKT_CLIENT_ID;

type ShowProps = {
  showId?: string;
  slug?: string;
};
export const traktShow = async ({ showId, slug }: ShowProps) => {
  const res = await fetch(
    `https://api.trakt.tv/shows/${
      showId ? showId : slug && slug
    }?extended=full`,
    {
      method: "GET",
      headers: new Headers({
        "Content-type": "application/json",
        "trakt-api-version": "2",
        "trakt-api-key": apiKey,
      }),
    }
  );

  const data = (await res.json()) as ShowSummary_Full;

  return data;
};