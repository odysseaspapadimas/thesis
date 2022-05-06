import { ActionIcon, Tooltip } from "@mantine/core";
import { Heart } from "tabler-icons-react";
import { ToggleOnListButtonProps } from "./AlreadyWatched";

const Favorite = ({ onList, handler }: ToggleOnListButtonProps) => {
  return (
    <Tooltip
      transitionDuration={50}
      position="bottom"
      withArrow
      label="Favorite"
    >
      <ActionIcon
        variant="filled"
        size="lg"
        radius={0}
        className="bg-slate-800 hover:bg-slate-900 transition-colors duration-75 rounded-full grid place-items-center p-3"
        onClick={handler}
        style={{ height: "unset", width: "unset" }}
      >
        <Heart
          className={
            onList?.on.includes("favorites") ? "text-red-500 fill-red-500" : ""
          }
        />
      </ActionIcon>
    </Tooltip>
  );
};
export default Favorite;
