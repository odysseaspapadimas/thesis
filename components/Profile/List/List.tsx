import { Badge, Group, Tabs } from "@mantine/core";
import { ListData } from "../../../constants/types";
import Movies from "./Movies";
import TVShows from "./TVShows";

const List = ({ data }: { data: ListData }) => {
  const moviesLength = data.movies.length;
  const showsLength = data.shows.length;
  return (
    <Tabs
      className="mt-4"
      variant="pills"
      color="gray"
      classNames={{
        tabsList: "flex flex-nowrap overflow-x-scroll sm:overflow-x-hidden mb-4",
      }}
      defaultValue="both"
    >
      <Tabs.List>
        <Tabs.Tab value="both"><TabLabel text="Both" length={moviesLength + showsLength} /></Tabs.Tab>
        <Tabs.Tab value="movies"><TabLabel text="Movies" length={moviesLength} /></Tabs.Tab>
        <Tabs.Tab value="shows"><TabLabel text="TV Shows" length={showsLength} /></Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="both">
        {moviesLength + showsLength === 0 ? <p>No items on this list...</p> :
          <>
            <Movies movies={data.movies} />
            <div className="my-4"></div>
            <TVShows shows={data.shows} />
          </>
        }

      </Tabs.Panel>
      <Tabs.Panel value="movies">
        {moviesLength === 0 ? <p>No items on this list...</p> :
          <Movies movies={data.movies} />
        }

      </Tabs.Panel>
      <Tabs.Panel value="shows">
        {showsLength === 0 ? <p>No items on this list...</p> :
          <TVShows shows={data.shows} />
        }
      </Tabs.Panel>
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
      <p>{text}</p>
      <div className="bg-primary rounded-full grid place-items-center h-5 w-5 text-xs">
        {length}
      </div>
    </div>
  );
};
