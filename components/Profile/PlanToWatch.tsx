import useSWR from "swr";
import fetcher from "../../helpers/fetcher";
import List from "./List/List";

const PlanToWatch = () => {
  const { data, error } = useSWR("/api/user/list?type=plan", fetcher);
  console.log(data, " planlistdata");
  return <List data={data} />;
};
export default PlanToWatch;
