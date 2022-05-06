import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/User";

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

    console.log(req.body);

    const user = await User.create(req.body);

    if (user) {
      res.status(200).send({ success: true });
    } else res.status(200).send({ success: false });
  }
}
