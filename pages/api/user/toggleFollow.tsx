import { UpdateResult } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/User";

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
  res: NextApiResponse<UpdateResult>
) {
  await dbConnect();

  const { myUsername, username, isFollowing } = req.query;

  
  if (isFollowing === "false") {

    console.log('hi')
    const response = await User.updateOne({ username }, { $addToSet: { followers: myUsername } });

    const response2 = await User.updateOne({ username: myUsername }, { $addToSet: { following: username } });
  
    console.log(response, 'follow res');

    res.status(201).json(response);
  } else {
    const response = await User.updateOne({ username }, { $pull: { followers: myUsername } });
    
    const response2 = await User.updateOne({ username: myUsername }, { $pull: { following: username } });

    console.log(response, 'follow res');

    res.status(201).json(response);
  }
}
