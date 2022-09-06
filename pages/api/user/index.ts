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
  res: NextApiResponse<User | Data>
) {
  await dbConnect();

  const { email, username } = req.query;

  let user;

  if (email) {
    user = await User.findOne({ email });
  } else if (username) {
    user = await User.findOne({ username });
  }

  if (user) {
    res.status(200).send({ user });
  } else res.status(404).send({ error: "User not found" }); //204 no information to send back
}
