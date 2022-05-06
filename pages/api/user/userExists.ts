import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/User";

type Data = {
  userExists: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const session = await getSession({ req });

  if (session) {
    await dbConnect();

    const { email } = req.query;

    const user = await User.findOne({ email });
    if (user) {
      res.status(200).json({ userExists: true });
    } else res.status(200).json({ userExists: false });
  }
}
