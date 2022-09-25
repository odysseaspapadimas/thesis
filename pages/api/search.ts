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

  const { q: query, type, page } = req.query;

  if (!query) {
    res.status(400).json({ error: "No query provided" });
  } else if (type === "media") {
    const result = await tmdb.searchMulti({ query: String(query) });

    res.status(200).json(result);
  } else {
    const atlasPlugin = require("mongoose-atlas-search");

    atlasPlugin.initialize({
      model: User,
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
          },
        };
      },
    });

    const usersResults = await User.find({ search: String(query) });

    const results = await tmdb.searchMulti({ query: String(query), page: Number(page) });

    if (results.results) {
      if (results.results.length === 20) {
        results.results.pop();
      }
    }

    if (usersResults && results.total_results) {
      console.log("total results");
      results.total_results += usersResults.length;
    } else if (usersResults && !results.total_results) {
      results.total_results = usersResults.length;
    }

    results.results = JSON.parse(JSON.stringify(usersResults)).concat(
      results.results
    );

    res.status(200).json(results)
  }
}
