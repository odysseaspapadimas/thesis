import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { Users } from "tabler-icons-react";
import dbConnect from "../../../../lib/dbConnect";
import User from "../../../../models/User";

export type List = {
  on: [ListTypes];
};

export type ListTypes = "watched" | "plan" | "favorites" | "rated" | "reviewed";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<List>
) {
  const session = await getSession({ req });

  if (session) {
    await dbConnect();

    const { username, id, type } = req.query;

    const user = await User.findOne({ username });

    let on = [] as unknown as List["on"];

    for (let i = 0; i < user.watched.length; i++) {
      if (user.watched[i].id === id && user.watched[i].type === type) {
        on.push("watched");
        break;
      }
    }
    for (let i = 0; i < user.plan_to.length; i++) {
      if (user.plan_to[i].id === id && user.plan_to[i].type === type) {
        on.push("plan");
        break;
      }
    }
    for (let i = 0; i < user.favorites.length; i++) {
      if (user.favorites[i].id === id && user.favorites[i].type === type) {
        on.push("favorites");
        break;
      }
    }

    for(let i = 0; i < user.ratings.length; i++) {
      if(user.ratings[i].id === id && user.ratings[i].type === type && user.ratings[i].rating) {
        on.push("rated")

        if(user.ratings[i].review) {
          on.push("reviewed")
        }
        break;
      }
    }

    res.status(200).json({ on });
  }
}
