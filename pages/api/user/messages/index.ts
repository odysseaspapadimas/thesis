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
    const {
      user,
      otherUser,
      text,
      media_id,
      media_type,
      media_name,
      image_path,
    } = req.body;

    if (session) {
      const messageObject = `messages.${otherUser}`;

      const messageObject2 = `messages.${user}`;

      if (text) {
        const response = await User.updateOne(
          { username: user },
          {
            $push: {
              [messageObject]: {
                text,
                sent: new Date(),
                me: true,
                read: {
                  state: false,
                  at: new Date(),
                },
              },
            },
          }
        );

        const response2 = await User.updateOne(
          { username: otherUser },
          {
            $push: {
              [messageObject2]: {
                text,
                sent: new Date(),
                me: false,
                read: {
                  state: false,
                  at: new Date(),
                },
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
      } else if (media_type) {
        const response = await User.updateOne(
          { username: user },
          {
            $push: {
              [messageObject]: {
                media_type,
                sent: new Date(),
                me: true,
                read: {
                  state: false,
                  at: new Date(),
                },
                media_id,
                media_name,
                image_path,
              },
            },
          }
        );

        const response2 = await User.updateOne(
          { username: otherUser },
          {
            $push: {
              [messageObject2]: {
                media_type,
                sent: new Date(),
                read: {
                  state: false,
                  at: new Date(),
                },
                media_id,
                media_name,
                image_path,
              },
            },
          }
        );

        console.log(response, "media res");
        res
          .status(201)
          .json(
            response.acknowledged &&
              response2.acknowledged && { successfull: true }
          );
      }
    }
  }
}
