import { Container } from "@mantine/core";
import { useRouter } from "next/router";

const search = () => {
  const router = useRouter();
  const { query } = router.query;
  return (
    <Container size="xl" py={48}>
      <div>
        You searched for "{query}" however this section is still under
        construction, check back again soon!
      </div>
    </Container>
  );
};
export default search;
