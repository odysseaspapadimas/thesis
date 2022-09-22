import { ActionIcon, Tooltip } from "@mantine/core";
import { Plus } from "tabler-icons-react";
import { ToggleOnListButtonProps } from "./AlreadyWatched";

const PlanToWatch = ({ onList, handler }: ToggleOnListButtonProps) => {
  return (
    <Tooltip
      transitionDuration={50}
      position="bottom"
      withArrow
      withinPortal
      label="Plan to Watch"
    >
      <ActionIcon
        variant="filled"
        size="lg"
        radius={0}
        className="bg-slate-800 hover:bg-slate-900 transition-colors duration-75 rounded-full grid place-items-center p-3"
        onClick={handler}
        style={{ height: "unset", width: "unset" }}
      >
        <Plus className={onList?.on.includes("plan") ? "text-primary" : ""} />
      </ActionIcon>
    </Tooltip>
  );
};
export default PlanToWatch;
