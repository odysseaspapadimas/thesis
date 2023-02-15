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
  const { type, id } = req.query;

  const session = await getSession({ req });

  await dbConnect();

  if (session) {
    const user = (await UserModel.findOne({
      email: session.user?.email,
    })) as User;

    const following = user.following;

    if (!following) {
      return res.status(200).json([]);
    }

    let planToUsers = (
      await UserModel.find({
        plan_to: { $elemMatch: { id } },
      })
    ).map((user) => ({ ...user, list: "plan_to" }));

    let watchedUsers = (
      await UserModel.find({
        watched: { $elemMatch: { id } },
      })
    ).map((user) => ({ ...user, list: "watched" }));

    let users = [...planToUsers, ...watchedUsers];
    
    users = users.filter(
      (_user) =>
        _user._doc.username !== user.username &&
        following.includes(_user._doc.username)
    );

    return res.status(200).json(users);
  }
}
