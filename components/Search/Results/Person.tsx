import { NextLink } from "@mantine/next";
import { MovieResult, TvResult } from "moviedb-promise";
import Image from "next/image";
import { IMG_URL } from "../../../constants/tmdbUrls";
import { PersonResult } from "../../../pages/search";

const Person = ({ result }: { result: PersonResult }) => {
  const link =
    "/person/" +
    result.id +
    "-" +
    result?.name?.toLowerCase().replace(/[\W_]+/g, "-");
  return (
    <div className="flex rounded-lg border border-gray-600 ">
      <NextLink href={link} className="h-[150px] w-fit">
        {result.profile_path ? (
          <Image
            src={IMG_URL(result.profile_path)}
            width={100}
            height={150}
            className="rounded-tl-lg rounded-bl-lg"
          />
        ) : (
          <div className="bg-slate-400 w-[100px] h-full  grid place-items-center">
            not found
          </div>
        )}
      </NextLink>
      <div className="p-3 flex-[2]">
        <NextLink href={link} className="text-lg font-semibold">
          <h2 >{result.name}</h2>
        </NextLink>
        <p>{result.known_for_department}</p>
        <span
          className="text-ellipsis overflow-hidden"
          style={{ WebkitLineClamp: 1, display: "-webkit-box" }}
        >
          {result.known_for && result.known_for.map((show: MovieResult | TvResult, i) => {
            let title;
            if (show.media_type === "movie") {
              title = show.title;
            } else {
              title = show.name;
            }
            return (
              <p key={show.id}>
                {title}
                {i < (result.known_for !== undefined && result.known_for.length - 1) && <>,&nbsp;</>}
              </p>
            );
          })}
        </span>
      </div>
    </div>
  );
};
export default Person;
