import { Select } from "@mantine/core";
import {
  DiscoverMovieRequest,
  DiscoverTvRequest,
} from "moviedb-promise/dist/request-types";
import React, { Dispatch, SetStateAction, useState } from "react";

const selectData = [
  { value: "popularity.desc", label: "Popularity Descending" },
  { value: "popularity.asc", label: "Popularity Ascending" },
  { value: "vote_average.desc", label: "Rating Descending" },
  { value: "vote_average.asc", label: "Rating Ascending" },
];

type SortProps = {
  sortBy: DiscoverMovieRequest["sort_by"] | DiscoverTvRequest["sort_by"];
  setSortBy:
    | Dispatch<SetStateAction<DiscoverMovieRequest["sort_by"]>>
    | Dispatch<SetStateAction<DiscoverTvRequest["sort_by"]>>;
};

const Sort = ({ sortBy, setSortBy }: SortProps) => {
  const [value, setValue] = useState(selectData[0].value);
  return (
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
  );
};

export default Sort;
