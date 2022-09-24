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
    const _otherUser = await User.findOne({ username: otherUser });

    const myMessages = _user.messages;

    const otherMessages = _otherUser.messages;

    const len1 = myMessages[otherUser].length - 1;

    const len2 = otherMessages[user].length - 1;

    if (session) {
      const messageObject = `messages.${otherUser}.${len1}.read`;
      const response = await User.updateOne(
        { username: user },
        {
          $set: {
            [messageObject]: {
              at: new Date(),
              state: true,
            },
          },
        }
      );
      const messageObject2 = `messages.${user}.${len2}.read`;
      const response2 = await User.updateOne(
        { username: otherUser },
        {
          $set: {
            [messageObject2]: {
              at: new Date(),
              state: true,
            },
          },
        }
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
