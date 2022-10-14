import { Center, Loader } from "@mantine/core";
import useSWR from "swr";
import { ListData } from "../../constants/types";
import fetcher from "../../helpers/fetcher";
import List from "./List/List";

const Favorites = ({ username }: { username: string }) => {
  const { data, error } = useSWR<ListData>(`/api/user/list?username=${username}&list=favorites`, fetcher);
  
  if (!data) {
    return (
      <Center my={16}>
        <Loader variant="bars" />
      </Center>
    );
  }
  return <List data={data} />;
};
export default Favorites;
