import { Select } from "@mantine/core";
import { DiscoverMovieRequest, DiscoverTvRequest } from "moviedb-promise";
import React, { Dispatch, SetStateAction, useState } from "react";

type SortProps = {
  sortBy: DiscoverMovieRequest["sort_by"] | DiscoverTvRequest["sort_by"];
  setSortBy:
    | Dispatch<SetStateAction<DiscoverMovieRequest["sort_by"]>>
    | Dispatch<SetStateAction<DiscoverTvRequest["sort_by"]>>;
  type: "movies" | "shows";
};

const Sort = ({ sortBy, setSortBy, type }: SortProps) => {
  const selectData = [
    { value: "popularity.desc", label: "Popularity Descending" },
    { value: "popularity.asc", label: "Popularity Ascending" },
    { value: "vote_average.desc", label: "Rating Descending" },
    { value: "vote_average.asc", label: "Rating Ascending" },
    {value: type === "movies" ? "release_date.desc" : "first_air_date.desc", label: "Release Date Descending"},
    {value: type === "movies" ? "release_date.asc" : "first_air_date.asc", label: "Release Date Ascending"}
  ];

  const [value, setValue] = useState(selectData[0].value);
  return (
    <div>
      <p>Sort by</p>
      <Select
        className="min-w-fit self-center"
        value={value}
        defaultValue={value}
        onChange={(e: keyof DiscoverMovieRequest["sort_by"]) => {
          if (!e) return;
          setValue(e);
          setSortBy(e);
        }}
        data={selectData}
      />
    </div>
  );
};

export default Sort;
