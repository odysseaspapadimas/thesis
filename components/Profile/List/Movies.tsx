import { MovieType } from "../../../constants/types";

const Movies = ({ movies }: { movies: [MovieType] }) => {
  return (
    <div>
      {movies.map((movie) => (
        <div>{movie.title}</div>
      ))}
    </div>
  );
};
export default Movies;
