import { Tabs } from "@mantine/core"
import Movies from "./Movies"

const List = () => {
  return (
    <Tabs variant="pills" color="blue">
        <Tabs.Tab label="Movies"><Movies /></Tabs.Tab>
        <Tabs.Tab label="TV Shows"><Movies /></Tabs.Tab>
    </Tabs>
  )
}
export default List