import { tmdb } from "./../../../../utils/tmdb";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import dbConnect from "../../../../lib/dbConnect";
import User from "../../../../models/User";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.query.username) {
    await dbConnect();

    let { list } = req.query;
    if (list === "plan") list = "plan_to";

    const user = await User.findOne({ username: req.query.username });

    const idList = user[String(list)];

    if (list === "reviews") {
      let mediaList = [] as any;
      const idList = user.ratings.filter((rating: any) => rating.review);
      for (let i = 0; i < idList.length; i++) {
        const item = idList[i];
        const { id, type } = item;
        if (type === "movie") {
          const movieData = await tmdb.movieInfo(id);
          mediaList = [...mediaList, movieData];
        } else if (type === "show") {
          const tvData = await tmdb.tvInfo(id);
          mediaList = [...mediaList, tvData];
        }
      }

      return res.status(200).send(mediaList);
    }

    let movieList = [] as any;
    let tvList = [] as any;

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
  } else {
    const session = await getSession({ req });
    const email = session?.user?.email;
    await dbConnect();

    let { list } = req.query;
    if (list === "plan") list = "plan_to";

    const user = await User.findOne({ email });

    const idList = user[String(list)];

    let movieList = [] as any;
    let tvList = [] as any;

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
