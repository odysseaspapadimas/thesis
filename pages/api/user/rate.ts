import { tmdb } from "../../../utils/tmdb";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import dbConnect from "../../../lib/dbConnect";
import UserModel from "../../../models/User";
import { User } from "../../../constants/types";
import { ShowResponse } from "moviedb-promise";
import Media from "../../../models/Media";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  const { id, type, rating, username } = req.body;

  await dbConnect();

  if (session) {
    const email = session.user?.email;

    if (req.method === "POST") {
      let response = await UserModel.updateOne(
        { email },
        {
          $set: { "ratings.$[elem].rating": rating },
        },
        { arrayFilters: [{ "elem.id": id, "elem.type": type }] }
      );
      console.log(response, "response1");

      if (response.modifiedCount === 0) {
        response = await UserModel.updateOne(
          { email },
          {
            $push: {
              ratings: { id, type, rating },
            },
          }
        );

        console.log(response, "response2");

        let response2 = await Media.updateOne(
          { id, type },
          {
            $push: {
              ratings: { username: username, rating },
            },
          },
          { upsert: true }
        );
      } else {
        let response2 = await Media.updateOne(
          { id, type },
          { $set: { "ratings.$[elem].rating": rating } },
          { arrayFilters: [{ "elem.username": username }] }
        );
      }

      res.status(200).json(response);
    } else if (req.method === "DELETE") {
      const response = await UserModel.updateOne(
        { email },
        {
          $pull: {
            ratings: { id, type },
          },
        }
      );

      const response2 = await Media.updateOne(
        { id, type },
        {
          $pull: {
            ratings: { username },
          },
        }
      );

      console.log(response, response2, 'responess')
      res.status(200).json(response);
    }
  }
}
