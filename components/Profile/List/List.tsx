import { Badge, Group, Tabs } from "@mantine/core";
import { ListData } from "../../../constants/types";
import Movies from "./Movies";
import TVShows from "./TVShows";

const List = ({ data }: { data: ListData }) => {
  const moviesLength = data.movies.length;
  const showsLength = data.shows.length;
  return (
    <Tabs
      variant="pills"
      color="blue"
      classNames={{
        tabsList: "flex flex-nowrap overflow-x-scroll sm:overflow-x-hidden ",
      }}
    >
      <Tabs.Tab
        label={<TabLabel text="Both" length={moviesLength + showsLength} />}
      >
        <Movies movies={data.movies} /> 
        <div className="my-4"></div>
        <TVShows shows={data.shows} />
      </Tabs.Tab>
      <Tabs.Tab label={<TabLabel text="Movies" length={moviesLength} />}>
        <Movies movies={data.movies} />
      </Tabs.Tab>
      <Tabs.Tab label={<TabLabel text="TV Shows" length={showsLength} />}>
        <TVShows shows={data.shows} />
      </Tabs.Tab>
    </Tabs>
  );
};
export default List;

type TabLabelProps = {
  text: string;
  length: number;
};

const TabLabel = ({ text, length }: TabLabelProps) => {
  return (
    <div className="flex whitespace-nowrap items-center space-x-2">
      <p>{text}</p>{" "}
      <div className="bg-primary rounded-full grid place-items-center h-5 w-5 text-xs">
        {length}
      </div>
    </div>
  );
};
