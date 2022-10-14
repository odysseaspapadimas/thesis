import { TVShowType } from "../../../constants/types";
import Show from "./Show";

const TVShows = ({ shows }: { shows: TVShowType[] }) => {
  return (
    <div className="flex flex-col space-y-4">
      {shows.map((show) => (
        <Show key={show.id} data={show} />
      )).reverse()}
    </div>
  );
};
export default TVShows;
