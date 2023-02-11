import { tmdb } from "../../../utils/tmdb";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import dbConnect from "../../../lib/dbConnect";
import UserModel from "../../../models/User";
import { User } from "../../../constants/types";
import { ShowResponse } from "moviedb-promise";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  await dbConnect();

  if (session) {
    const user = (await UserModel.findOne({
      email: session.user?.email,
    })) as User;

    const following = user.following;

    const activity = [] as any;

    if (!following) return res.status(200).json([]);

    for (let i = 0; i < following.length; i++) {
      const username = following[i];
      let _user = (await UserModel.findOne({
        username,
      })) as User;

      console.log(_user, "user");
      const user_activity = [] as any;

      if (_user?.activity && _user.activity.length > 0) {
        for (let i = 0; i < _user.activity.length; i++) {
          const userActivity = _user.activity[i];

          if (userActivity.media.type === "show") {
            const show = (await tmdb.tvInfo(
              userActivity.media.id
            )) as ShowResponse;
            userActivity.media.media_name = show.name;
            userActivity.media.image_path = show.poster_path;
          } else if (userActivity.media.type === "movie") {
            const movie = await tmdb.movieInfo(userActivity.media.id);
            userActivity.media.media_name = movie.title;
            userActivity.media.image_path = movie.poster_path;
          }
          userActivity.user = {} as any;
          userActivity.user.username = _user.username;
          userActivity.user.image_url = _user.image_url;
          activity.push(userActivity);
        }
      }
    }

    activity.sort((a: any, b: any) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    console.log(activity, "user_activity");
    res.status(200).json(activity);
  }
}
