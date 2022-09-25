import { NextLink } from "@mantine/next";
import { MovieResult, TvResult } from "moviedb-promise";
import Image from "next/image";
import { ExoticComponent, ForwardRefExoticComponent, MutableRefObject, useEffect, useRef, useState } from "react";
import { IMG_URL } from "../../../constants/tmdbUrls";

type SearchResultP = {
  id?: number;
  name?: string | undefined;
  poster_path?: string | undefined;
  overview?: string | undefined;
  release_date?: string;
  link?: string;
  media_type?: string;
};

const Show = ({ result }: { result: MovieResult | TvResult }) => {
  let link, title, release_date, overview, image_path;
  result.poster_path ? (image_path = IMG_URL(result.poster_path)) : null;
  if (result.media_type === "tv") {
    link =
      "/show/" +
      result.id +
      "-" +
      result?.name?.toLowerCase().replace(/[\W_]+/g, "-");

    title = result.name;
    result.poster_path;
    release_date = result.first_air_date;
    overview = result.overview;
  } else {
    link =
      "/movie/" +
      result.id +
      "-" +
      result?.title?.toLowerCase().replace(/[\W_]+/g, "-");

    title = result.title;
    release_date = result.release_date;
    overview = result.overview;
  }

  const titleRef = useRef() as MutableRefObject<HTMLAnchorElement>;
  const [lineClamp, setLineClamp] = useState(3);

  useEffect(() => {
    if (!titleRef.current || !document.defaultView) return;
    const titleHeight = titleRef.current.offsetHeight;
    setLineClamp(Math.round(4 - titleHeight / 25));
  }, [titleRef]);

  return (
    <div className="flex rounded-lg border border-gray-600 h-[152px]">
      <NextLink href={link} className=" w-fit">
        {image_path ? (
          <Image
            src={image_path}
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
        <NextLink href={link} ref={titleRef} className="text-lg font-semibold">
          <h2 >
            {title}
          </h2>
        </NextLink>
        <p className="text-gray-500">{release_date}</p>
        <div
          className="text-ellipsis overflow-hidden "
          style={{
            WebkitLineClamp: lineClamp,
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
          }}
        >
          <p>{result.overview}</p>
        </div>
      </div>
    </div>
  );
};
export default Show;
