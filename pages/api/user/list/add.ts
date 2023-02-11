import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import dbConnect from "../../../../lib/dbConnect";
import User from "../../../../models/User";

type Data = {
  success: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const session = await getSession({ req });

  if (session) {
    await dbConnect();
    const email = session.user?.email;

    let { list } = req.query;

    let type = req.query.type as string;
    let id = req.query.id as string;

    let response;
    if (list === "plan") {
      response = await User.updateOne(
        { email },
        {
          $push: {
            plan_to: { id, type },
            activity: {
              type: list,
              createdAt: new Date(),
              media: { id, type },
            },
          },
        }
      );
    } else if (list === "watched") {
      response = await User.updateOne(
        { email },
        {
          $push: {
            watched: { id, type },
            activity: {
              type: list,
              createdAt: new Date(),
              media: { id, type },
            },
          },
        }
      );
    } else {
      response = await User.updateOne(
        { email },
        {
          $push: {
            favorites: {
              id,
              type,
            },
            activity: {
              type: list,
              createdAt: new Date(),
              media: { id, type },
            },
          },
        }
      );
    }

    if (response.acknowledged) {
      res.status(200).send({ success: true });
    } else res.status(200).send({ success: false });
  }
}
