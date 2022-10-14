import { MovieType } from "../../../constants/types";
import Show from "./Show";

const Movies = ({ movies }: { movies: MovieType[] }) => {
  return (
    <div className="flex flex-col space-y-4">
      {movies.map((movie) => (
        <Show key={movie.id} data={movie} />
      )).reverse()}
    </div>
  );
};
export default Movies;
