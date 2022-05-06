import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { Users } from "tabler-icons-react";
import dbConnect from "../../../../lib/dbConnect";
import User from "../../../../models/User";

export type List = {
  on: [ListTypes];
};

export type ListTypes = "watched" | "plan" | "favorite";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<List>
) {
  const session = await getSession({ req });

  if (session) {
    await dbConnect();

    const { username, id } = req.query;

    const user = await User.findOne({ username });

    let on = [] as unknown as List["on"];

    for (let i = 0; i < user.watched.length; i++) {
      if (user.watched[i].id === id) {
        on.push("watched");
        break;
      }
    }
    for (let i = 0; i < user.plan_to.length; i++) {
      if (user.plan_to[i].id === id) {
        on.push("plan");
        break;
      }
    }
    for (let i = 0; i < user.favorite.length; i++) {
      if (user.favorite[i].id === id) {
        on.push("favorite");
        break;
      }
    }

    res.status(200).json({ on });
  }
}
