import Image from "next/image";
import { FC } from "react";
import { IMG_URL } from "../constants/tmdbUrls";
import { ActionIcon, Button, Menu } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Tooltip } from "@mantine/core";
import { NextLink } from "@mantine/next";
import { Dots, Plus } from "tabler-icons-react";
import { MovieType, TVShowType } from "../constants/types";
import { useSession } from "next-auth/react";

const Show = ({ data }: { data: MovieType | TVShowType }) => {
  const [opened, handlers] = useDisclosure(false);
  let name, release_date, link;

  if (data.hasOwnProperty("title")) {
    data = data as MovieType;
    name = data.title;
    release_date = data.release_date.split("-")[0];
    link =
      "/movie/" +
      data.id +
      "-" +
      data.title.toLowerCase().replaceAll(/[\W_]+/g, "-");
  } else {
    data = data as TVShowType;
    name = data.name;
    release_date = data.first_air_date.split("-")[0];
    link =
      "/show/" +
      data.id +
      "-" +
      data.name.toLowerCase().replaceAll(/[\W_]+/g, "-");
  }

  const { data: session } = useSession();

  return (
    <div className="relative w-[140px] sm:w-[175px]">
      <NextLink href={link} className="">
        <div
          className="w-[140px] sm:w-[175px] relative cursor-pointer rounded-sm border border-transparent hover:border-blue-400"
          style={{ aspectRatio: "1 / 1.5" }}
        >
          <Image layout="fill" src={IMG_URL(data.poster_path)} />
        </div>
      </NextLink>
      {session && (
        <Menu
          control={
            <ActionIcon
              className="hover:bg-slate-800 transition-colors duration-75"
              variant="filled"
            >
              <Dots />
            </ActionIcon>
          }
          size="sm"
          gutter={0}
          placement="end"
          className="absolute top-2 right-2 z-10"
        >
          <Menu.Item>Already Watched</Menu.Item>
          <Menu.Item>Plan to Watch</Menu.Item>
        </Menu>
      )}
      <p className=" text-base font-semibold mt-1">
        {name} ({release_date})
      </p>
    </div>
  );
};
export default Show;
