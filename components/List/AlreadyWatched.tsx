import { ActionIcon, Tooltip } from "@mantine/core";
import { MouseEventHandler } from "react";
import { Eye } from "tabler-icons-react";

type OnList = {
  on: ["watched" | "plan" | "favorite" | unknown];
};

export type ToggleOnListButtonProps = {
  onList: OnList;
  handler: MouseEventHandler<HTMLButtonElement>;
};

const AlreadyWatched = ({ onList, handler }: ToggleOnListButtonProps) => {
  return (
    <Tooltip
      transitionDuration={50}
      position="bottom"
      withArrow
      label="Already Watched"
    >
      <ActionIcon
        variant="filled"
        size="lg"
        className="bg-slate-800 hover:bg-slate-900 transition-colors duration-75 rounded-full grid place-items-center p-3"
        onClick={handler}
        style={{ height: "unset", width: "unset" }}
      >
        <Eye className={onList?.on.includes("watched") ? "text-primary" : ""} />
      </ActionIcon>
    </Tooltip>
  );
};
export default AlreadyWatched;
