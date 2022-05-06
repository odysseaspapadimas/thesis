import Image from "next/image";
import { FC } from "react";
import { IMG_URL } from "../constants/tmdbUrls";
import { ActionIcon, Button, Menu } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Tooltip } from "@mantine/core";
import { NextLink } from "@mantine/next";
import { Dots, Plus } from "tabler-icons-react";
import { MovieType } from "../constants/types";

const Movie = ({ data }: { data: MovieType }) => {
  const [opened, handlers] = useDisclosure(false);
  return (
    <div className="relative cursor-pointer rounded-sm border border-transparent hover:border-blue-400 h-[227px]">
      <Tooltip
        withArrow
        label={`${data.title} (${data.release_date.split("-")[0]})`}
      >
        <NextLink
          href={
            "/movie/" +
            data.id +
            "-" +
            data.title.toLowerCase().replaceAll(/[\W_]+/g, "-")
          }
        >
          <Image height={225} width={150} src={IMG_URL(data.poster_path)} />
        </NextLink>
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
      </Tooltip>
    </div>
  );
};
export default Movie;
