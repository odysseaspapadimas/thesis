import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import dbConnect from "../../lib/dbConnect";
import User from "../../models/User";
import { tmdb } from "../../utils/tmdb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  await dbConnect();

  const { q: query } = req.query;

  if (!query) {
    res.status(400).json({ error: "No query provided" });
  } else {
    const result = await tmdb.searchMulti({ query: String(query) });

    res.status(200).json(result);
  }
}
