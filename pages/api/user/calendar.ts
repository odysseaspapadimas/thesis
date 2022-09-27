import { tmdb } from "../../../utils/tmdb";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import dbConnect from "../../../lib/dbConnect";
import UserModel from "../../../models/User";
import { User } from "../../../constants/types";
import { ShowResponse } from "moviedb-promise";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  await dbConnect();

  if (session) {
    const user = (await UserModel.findOne({
      email: session.user?.email,
    })) as User;

    let list = [] as { id: string; type: "movie" | "show" }[];

    if (user.plan_to && !user.watched) {
      list = user.plan_to;
    } else if (user.watched && !user.plan_to) {
      list = user.watched;
    } else if (user.plan_to && user.watched) {
      list = user.plan_to.concat(user.watched);
    }

    let shows = [] as ShowResponse[];

    for (let i = 0; i < list.length; i++) {
      const item = list[i];

      if (item.type === "show") {
        const show = await tmdb.tvInfo({ id: item.id });
        shows = [...shows, show];
      }
    }

    console.log(shows, "shows");
    res.status(200).json(shows);
  }
}
