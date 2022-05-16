import { Button, RangeSlider } from "@mantine/core";
import { Dispatch, SetStateAction, useState } from "react";

type FiltersProps = {
  handleSearch: (arg0: any) => void;
};

const Filters = ({ handleSearch }: FiltersProps) => {
  const [filters, setFilters] = useState({
    "vote_average.gte": 0.0,
    "vote_average.lte": 10.0,
  });

  const [voteRange, setVoteRange] = useState<[number, number]>([0, 100]);

  const handleVote = (value: [number, number]) => {
    let newFilters = filters;
    newFilters["vote_average.gte"] = value[0] / 10;
    newFilters["vote_average.lte"] = value[1] / 10;
    setFilters(newFilters);
  };

  return (
    <div className="flex-1 p-2">
      <h2>Rating</h2>
      <RangeSlider
        mb={32}
        onChangeEnd={handleVote}
        marks={[
          { value: 0, label: "0.0" },
          { value: 10 },
          { value: 20 },
          { value: 30 },
          { value: 40 },
          { value: 50 },
          { value: 60 },
          { value: 70 },
          { value: 80 },
          { value: 90 },
          { value: 100, label: "10.0" },
        ]}
      />

      <Button onClick={() => handleSearch(filters)} className="bg-primary">
        Filter
      </Button>
    </div>
  );
};
export default Filters;
