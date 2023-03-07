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

  const { review, id, type, username, image_url } = req.body;

  await dbConnect();

  if (session) {
    const email = session.user?.email;

    if (req.method === "POST") {
      let response = await UserModel.updateOne(
        { email },
        {
          $set: { "ratings.$[elem].review": review },
        },
        { arrayFilters: [{ "elem.id": id, "elem.type": type }] }
      );

      let response2;

      if (response.modifiedCount === 0) {
        response = await UserModel.updateOne(
          { email },
          {
            $push: {
              ratings: { id, type, review },
            },
          }
        );

        response2 = await Media.findOneAndUpdate(
          { id, type },
          {
            $push: {
              ratings: { username: username, review, image_url },
            },
          },
          { upsert: true, new: true }
        );
      } else {
        response2 = await Media.findOneAndUpdate(
          { id, type },
          {
            $set: {
              "ratings.$[elem].review": review,
              "ratings.$[elem].image_url": image_url,
            },
          },
          { arrayFilters: [{ "elem.username": username }], new: true }
        );
      }

      res.status(200).json(response2);
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

      console.log(response, response2, "responess");
      res.status(200).json(response);
    } else if (req.method === "GET") {
      const { id, type } = req.query;

      const response = await Media.findOne({ id, type });

      res.status(200).json(response);
    }
  }
}
