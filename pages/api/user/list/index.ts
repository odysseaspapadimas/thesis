import { tmdb } from "./../../../../utils/tmdb";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import dbConnect from "../../../../lib/dbConnect";
import User from "../../../../models/User";

type Data = {
  error: string;
};

export type User = {
  email: string;
  username: string;
  createdAt: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<User | Data>
) {
  const session = await getSession({ req });

  console.log("getlist runs");

  if (session) {
    const email = session.user?.email;
    await dbConnect();

    let { type } = req.query;
    if (type === "plan") type = "plan_to";

    console.log(type, "listype");

    const user = await User.findOne({ email });

    const idList = user[String(type)];

    let movieList = [] as any;

    //Inlcude movie/tvshow type in list e.g. plan_to = [ { id: 5553, type: movie } ]
    //So i can make seperate calls in the for loop

    for (let i = 0; i < idList.length; i++) {
      const id = idList[i].id;
      const movieData = await tmdb.movieInfo(id);
      movieList = [...movieList, movieData];
    }

    console.log(movieList, "movieList");

    if (user) {
      res.status(200).send(movieList);
    } else res.status(400).send({ error: "Something went wrong" });
  }
}
