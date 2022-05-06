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

    let { list, type, id } = req.query;

    let response;
    if (list === "plan") {
      response = await User.updateOne(
        { email },
        { $pull: { plan_to: { id, type } } }
      );
    } else if (list === "watched") {
      response = await User.updateOne(
        { email },
        { $pull: { watched: { id, type } } }
      );
    } else {
      response = await User.updateOne(
        { email },
        { $pull: { favorites: { id, type } } }
      );
    }

    if (response.acknowledged) {
      res.status(200).send({ success: true });
    } else res.status(200).send({ success: false });
  }
}
