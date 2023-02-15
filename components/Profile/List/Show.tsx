import { ActionIcon, Menu } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { NextLink } from "@mantine/next";
import { useSession } from "next-auth/react";
import Image from "next/image";
import useSWR, { useSWRConfig } from "swr";
import { Dots, Eye, Heart, Plus } from "tabler-icons-react";
import { IMG_URL } from "../../../constants/tmdbUrls";
import { MovieType, TVShowType } from "../../../constants/types";
import fetcher from "../../../helpers/fetcher";
import useUser from "../../../hooks/use-user";
import addToList, { Type } from "../../../utils/addToList";
import removeFromList from "../../../utils/removeFromList";
import { MutableRefObject, useEffect, useRef, useState } from "react";

const Show = ({ data }: { data: MovieType | TVShowType }) => {
  let link, title, release_date, image_path;
  data.poster_path ? (image_path = IMG_URL(data.poster_path)) : null;

  let type = "show" as Type;
  if (data.hasOwnProperty("name")) {
    data = data as TVShowType;
    type = "show";
    link =
      "/show/" +
      data.id +
      "-" +
      data?.name?.toLowerCase().replace(/[\W_]+/g, "-");

    title = data.name;
    data.poster_path;
    release_date = data.first_air_date;
  } else {
    data = data as MovieType;
    type = "movie";
    link =
      "/movie/" +
      data.id +
      "-" +
      data?.title?.toLowerCase().replace(/[\W_]+/g, "-");

    title = data.title;
    release_date = data.release_date;
  }
  const matches = useMediaQuery("(max-width: 600px)");

  const titleRef = useRef() as MutableRefObject<HTMLHeadingElement>;
  const [lineClamp, setLineClamp] = useState(3);

  useEffect(() => {
    if (!titleRef.current || !document.defaultView) return;
    const titleHeight = titleRef.current.offsetHeight;
    setLineClamp(Math.round(4 - titleHeight / 25));
  }, [titleRef]);

  const { mutate } = useSWRConfig();

  const { data: session } = useSession();

  const { user } = useUser({ session });

  const {
    data: onList,
    error: onListError,
    mutate: mutateOnList,
  } = useSWR(
    user
      ? `/api/user/list/onList?username=${user.username}&id=${data.id}&type=${type}`
      : null,
    fetcher
  );

  const handleWatched = async () => {
    if (!onList.on.includes("watched")) {
      await addToList("watched", String(data.id), type);

      if (onList.on.includes("plan")) {
        await removeFromList("plan", String(data.id), type);
      }
    } else if (onList.on.includes("watched")) {
      await removeFromList("watched", String(data.id), type);
    }
    mutate("/api/user/list?list=plan");
    mutate("/api/user/list?list=watched");
    mutateOnList();
  };

  const handlePlan = async () => {
    if (!onList.on.includes("plan")) {
      await addToList("plan", String(data.id), type);

      if (onList.on.includes("watched")) {
        await removeFromList("watched", String(data.id), type);
      }
    } else if (onList.on.includes("plan")) {
      await removeFromList("plan", String(data.id), type);
    }

    mutate("/api/user/list?list=plan");
    mutate("/api/user/list?list=watched");
    mutateOnList();
  };

  const handleFavorite = async () => {
    console.log("hi");
    if (!onList.on.includes("favorites")) {
      await addToList("favorites", String(data.id), type);
    } else if (onList.on.includes("favorites")) {
      await removeFromList("favorites", String(data.id), type);
    }
    mutate("/api/user/list?list=favorites");
    mutateOnList();
  };

  return (
    <div className="flex relative rounded-lg border border-gray-600 h-[152px]">
      <NextLink href={link} className="min-w-[100px]">
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
        <NextLink href={link}>
          <h2
            className="sm:text-lg font-semibold"
            style={{ maxWidth: "calc(100% - 28px)" }}
            ref={titleRef}
          >
            {title}
          </h2>
        </NextLink>
        {/* maxWidth is so it doesn't overlap with the menu */}
        <p className="text-gray-500">{release_date}</p>
        <div
          className="text-ellipsis overflow-hidden "
          style={{
            WebkitLineClamp: lineClamp,
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
          }}
        >
          <p>{data.overview}</p>
        </div>
      </div>

      {session && (
        <div className="absolute top-2 right-2 z-10">
          <Menu
            position="bottom-end"
            classNames={{
              item: "px-2 whitespace-nowrap",
            }}
          >
            <Menu.Target>
              <ActionIcon
                className="hover:bg-slate-800 transition-colors duration-75"
                variant="filled"
              >
                <Dots />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item
                onClick={handleWatched}
                icon={
                  <Eye
                    size={14}
                    className={onList?.on.includes("watched") ? "text-primary" : ""}
                  />
                }
              >
                Already Watched
              </Menu.Item>
              <Menu.Item
                onClick={handlePlan}
                icon={
                  <Plus
                    size={14}
                    className={onList?.on.includes("plan") ? "text-primary" : ""}
                  />
                }
              >
                Plan to Watch
              </Menu.Item>
              <Menu.Item
                onClick={handleFavorite}
                icon={
                  <Heart
                    size={14}
                    className={
                      onList?.on.includes("favorites") ? "text-red-500" : ""
                    }
                  />
                }
              >
                Favorite
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>
      )}
    </div>
  );
};
export default Show;
