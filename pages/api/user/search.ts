import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import dbConnect from "../../../lib/dbConnect";
import UserModel from "../../../models/User";

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
  res: NextApiResponse<User | any>
) {
  const session = await getSession({ req });
  if (session) {
    await dbConnect();

    const { query } = req.query;

    const atlasPlugin = require("mongoose-atlas-search");

    atlasPlugin.initialize({
      model: UserModel,
      overwriteFind: true,
      searchKey: "search",
      searchFunction: (query: any) => {
        return {
          index: "username",
          text: {
            query: `${query}`,
            path: {
              wildcard: "*",
            },
            fuzzy: {},
          },
        };
      },
    });

    let usersResults = await UserModel.find({ search: query });

    usersResults = usersResults.filter(
      (user) => user.email !== session?.user?.email
    );

    res.status(200).json(usersResults);
  }
}
