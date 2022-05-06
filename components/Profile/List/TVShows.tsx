import { TVShowType } from "../../../constants/types";

const TVShows = ({ shows }: { shows: [TVShowType] }) => {
  return (
    <div>
      {shows.map((show) => (
        <div>{show.name}</div>
      ))}
    </div>
  );
};
export default TVShows;
