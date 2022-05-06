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

    let { type, id } = req.query;

    let response;
    if (type === "plan") {
      response = await User.updateOne(
        { email },
        { $push: { plan_to: { id } } }
      );
    } else if (type === "watched") {
      response = await User.updateOne(
        { email },
        { $push: { watched: { id } } }
      );
    } else {
      response = await User.updateOne(
        { email },
        { $push: { favorite: { id } } }
      );
    }

    if (response.acknowledged) {
      res.status(200).send({ success: true });
    } else res.status(200).send({ success: false });
  }
}
