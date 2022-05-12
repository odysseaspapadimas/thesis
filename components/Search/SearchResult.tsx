import { Group } from "@mantine/core";
import { NextLink } from "@mantine/next";
import Image from "next/image";
import { IMG_URL } from "../../constants/tmdbUrls";
import { Type } from "../../utils/addToList";

type SearchResultP = {
  id?: number;
  name: string | undefined;
  poster_path: string | undefined;
  overview: string | undefined;
  release_date?: string;
  link?: string;
  media_type: string;
};

const SearchResult = ({ result }: { result: SearchResultP }) => {
  return (
    <div className="flex rounded-lg border border-gray-600">
      <NextLink href={result.link}>
        <Image
          src={IMG_URL(result.poster_path)}
          width={100}
          height={150}
          className="rounded-tl-lg rounded-bl-lg"
        />
      </NextLink>
      <div className="p-3">
        <h2 className="text-lg font-semibold">{result.name}</h2>
        <p className="text-gray-500">{result.release_date}</p>
        <p className="text-ellipsis overflow-hidden" style={{WebkitLineClamp: 2, display: 'box'}}>{result.overview}</p>
      </div>
    </div>
  );
};
export default SearchResult;
