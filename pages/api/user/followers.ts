import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/User";

type Data = {
  user?: User;
  error?: string;
};

export type User = {
  email: string;
  username: string;
  createdAt: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  await dbConnect();

  const { username } = req.query;

  const user = await User.findOne({ username });

  let followers = [];

  for (let i = 0; i < user.followers.length; i++) {
    const { image_url, username } = await User.findOne({
      username: user.followers[i],
    });

    followers.push({username, image_url});
  }

  res.status(200).json(followers);
}
