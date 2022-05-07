import { tmdb } from "./../../../../utils/tmdb";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import dbConnect from "../../../../lib/dbConnect";
import User from "../../../../models/User";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (session) {
    const email = session.user?.email;
    await dbConnect();

    let { list } = req.query;
    if (list === "plan") list = "plan_to";

    const user = await User.findOne({ email });

    const idList = user[String(list)];

    console.log(idList, "idList", list, 'listtype');

    let movieList = [] as any;
    let tvList = [] as any;

    //Inlcude movie/tvshow type in list e.g. plan_to = [ { id: 5553, type: movie } ]
    //So i can make seperate calls in the for loop

    for (let i = 0; i < idList.length; i++) {
      const item = idList[i];
      const { id, type } = item;
      if (type === "movie") {
        const movieData = await tmdb.movieInfo(id);
        movieList = [...movieList, movieData];
      } else if (type === "show") {
        const tvData = await tmdb.tvInfo(id);
        tvList = [...tvList, tvData];
      }
    }

    if (user) {
      res.status(200).json({ movies: movieList, shows: tvList });
    } else res.status(400).send({ error: "Something went wrong" });
  }
}
