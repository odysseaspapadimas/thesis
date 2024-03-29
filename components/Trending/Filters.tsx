import { Button, Checkbox, Group, RangeSlider } from "@mantine/core";
import dayjs from "dayjs";
import { DatePicker } from "@mantine/dates";
import { DiscoverMovieRequest } from "moviedb-promise";
import { DiscoverTvRequest } from "../../constants/types";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Genre } from "moviedb-promise/dist/types";
import { useRouter } from "next/router";

type FiltersProps = {
  filters: DiscoverMovieRequest | DiscoverTvRequest;
  setFilters:
  | Dispatch<SetStateAction<DiscoverMovieRequest>>
  | Dispatch<SetStateAction<DiscoverTvRequest>>;
  genresList: Array<Genre>;
  type: "movies" | "shows";
  handleSearch: () => void;
};

const isMovieRequest = (
  filters: DiscoverMovieRequest | DiscoverTvRequest
): filters is DiscoverMovieRequest => {
  return (filters as DiscoverMovieRequest)["primary_release_date.lte"] !== undefined;
};

const Filters = ({ filters, setFilters, genresList, type, handleSearch }: FiltersProps) => {

  const router = useRouter();
  const { genres } = router.query;

  const [includeOnList, setIncludeOnList] = useState(true);

  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(new Date());

  useEffect(() => {
    if (!genres || !genresList || !setFilters) return;
    let newFilters = filters;
    newFilters["with_genres"] = "";
    genresList.forEach((genre) => {
      String(genres).split(",").forEach((_genre) => {
        console.log(genre.name?.split(" ")[0].toLocaleLowerCase(), _genre, 'tests')
        if (genre.name?.split(" ")[0].toLocaleLowerCase() === _genre.trim() && genre.id) {
          if (!newFilters["with_genres"]) {
            newFilters["with_genres"] += `${genre.id}`
          } else {
            newFilters["with_genres"] += `,${genre.id}`
          }
        }
      })
    })

    //@ts-ignore
    setFilters(newFilters)
    handleSearch();
    console.log(newFilters, 'genres')
  }, [genres, genresList, setFilters])

  const handleVote = (value: [number, number]) => {
    let newFilters = filters;
    newFilters["vote_average.gte"] = value[0] / 10;
    newFilters["vote_average.lte"] = value[1] / 10;
    //@ts-ignore
    setFilters(newFilters);
  };

  const handleDate = (date: Date | null, label: "from" | "to") => {
    let newFilters = filters;

    console.log(isMovieRequest(newFilters), "ismovie");
    if (label === "to" && date && fromDate) {
      if (fromDate > date) {
        setFromDate(date);
      }
    }

    if (label === "from") {
      if (!isMovieRequest(newFilters)) {
        if (!date) {
          delete newFilters["air_date.gte"];
        } else {
          newFilters["air_date.gte"] = dayjs(date).format("YYYY-MM-DD");
        }
      } else {
        if (!date) {
          delete newFilters["primary_release_date.gte"];
        } else {
          newFilters["primary_release_date.gte"] =
            dayjs(date).format("YYYY-MM-DD");
        }
      }
    } else {
      if (!isMovieRequest(newFilters)) {
        if (!date) {
          delete newFilters["air_date.lte"];
        } else {
          newFilters["air_date.lte"] = dayjs(date).format("YYYY-MM-DD");
        }
      } else {
        if (!date) {
          delete newFilters["primary_release_date.lte"];
        } else {
          newFilters["primary_release_date.lte"] =
            dayjs(date).format("YYYY-MM-DD");
        }
      }
    }

    console.log(newFilters, "newfilters");
    //@ts-ignore
    setFilters(newFilters);
  };

  const handleGenre = (id: number | undefined, name: string | undefined) => {
    let newFilters = filters;

    if (!newFilters.with_genres) {
      newFilters.with_genres = "";
    }

    if (
      !filters.with_genres?.includes(",") &&
      filters.with_genres?.includes(String(id))
    ) {
      newFilters.with_genres = "";
    } else if (filters.with_genres?.includes(String(id))) {
      newFilters["with_genres"] = filters.with_genres.replace(`,${id}`, "");
      newFilters["with_genres"] = filters.with_genres.replace(`${id}`, "");
    } else if (newFilters.with_genres.length === 0) {
      newFilters["with_genres"] += `${id}`;
    } else {
      newFilters["with_genres"] += `,${id}`;
    }
    //@ts-ignore
    setFilters({ ...newFilters });
  };

  useEffect(() => {
    console.log("filters", filters);
  }, [filters]);

  return (
    <div className="">
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

      {/* <Group spacing="xs" py={16}>
        <Checkbox
          checked={includeOnList}
          onChange={(e) => setIncludeOnList(e.currentTarget.checked)}
        />
        <h2>Include items on my lists</h2>
      </Group> */}

      <h2>{type === "movies" ? "Release Dates" : "Air Dates"}</h2>
      <DatePicker
        value={fromDate}
        allowFreeInput
        onChange={(e) => {
          handleDate(e, "from");
          setFromDate(e);
        }}
        maxDate={toDate ? toDate : undefined}
        placeholder="Pick date"
        inputFormat="MM/DD/YYYY"
        label="From"
        variant="filled"
      />
      <DatePicker
        value={toDate}
        allowFreeInput
        onChange={(e) => {
          handleDate(e, "to");
          if (e) {
            setToDate(e);
          }
        }}
        placeholder="Pick date"
        inputFormat="MM/DD/YYYY"
        label="To"
        defaultValue={new Date()}
      />

      <div className="max-w-fit my-4 space-y-2">
        {genresList.map(({ id, name }) => (
          <Button
            key={id}
            onClick={() => handleGenre(id, name)}
            className={`border border-gray-400 hover:border-transparent px-2 rounded-xl mr-2 ${filters.with_genres?.includes(String(id))
              ? "bg-[#1864AB] border-transparent"
              : ""
              }`}
          >
            {name}
          </Button>
        ))}
      </div>
    </div>
  );
};
export default Filters;
