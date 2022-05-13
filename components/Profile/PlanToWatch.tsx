import { Center, Loader } from "@mantine/core";
import useSWR from "swr";
import { ListData } from "../../constants/types";
import fetcher from "../../helpers/fetcher";
import List from "./List/List";

const PlanToWatch = () => {
  const { data, error } = useSWR<ListData>("/api/user/list?list=plan", fetcher);
  console.log(data, " planlistdata");
  if (!data) {
    return (
      <Center>
        <Loader variant="bars" />
      </Center>
    );
  }
  return <List data={data} />;
};
export default PlanToWatch;
