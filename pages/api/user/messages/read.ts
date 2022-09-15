import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import dbConnect from "../../../../lib/dbConnect";
import User from "../../../../models/User";

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

  const session = await getSession({ req });

  if (req.method === "POST") {
    const { user, otherUser } = req.body;

    const _user = await User.findOne({ username: user });

    const messages = _user.messages;

    const len = messages[otherUser].length - 1;

    if (session) {
      const messageObject = `messages.${otherUser}.${len}.read`;
      const response = await User.updateOne(
        { username: user },
        { $set: { [messageObject]: true } }
      );

      res.status(201).json(response.acknowledged && { successfull: true });
    }
  }
}
