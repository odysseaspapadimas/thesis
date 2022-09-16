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

  if (req.method === "GET") {
    const { username } = req.query;

    const user = await User.findOne({ username });

    res.status(200).json(user.messages);

  } else if (req.method === "POST") {
    const { user, otherUser, text } = req.body;
    
    if (session) {
      const messageObject = `messages.${otherUser}`;
      const response = await User.updateOne(
        { username: user },
        { $push: { [messageObject]: { text, sent: new Date(), me: true } } }
      );

      const messageObject2 = `messages.${user}`;
      const response2 = await User.updateOne(
        { username: otherUser },
        { $push: { [messageObject2]: { text, sent: new Date(), me: false, read: false } } }
      );

      res
        .status(201)
        .json(
          response.acknowledged &&
            response2.acknowledged && { successfull: true }
        );
    }
  }
}
