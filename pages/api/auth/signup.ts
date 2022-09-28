import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/User";
import bcrypt from "bcrypt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  const { email, password, username } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400).json({ error: "User already registered" });
    return;
  }

  //   email: session?.user?.email,
  //         username: values.username,
  //         createdAt: new Date(),
  //         image_url: session?.user?.image

  const salt = await bcrypt.genSalt(10);

  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    email,
    username,
    password: hashedPassword,
    createdAt: new Date(),
    image_url: "/avatar.png",
  });

  if (user) {
    res.status(200).json({ ok: true });
  }
}
