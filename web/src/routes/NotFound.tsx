import PageCenteredPaper from "../components/PageCenteredPaper";
import { Alert, Anchor, Title } from "@mantine/core";
import { buildTitle } from "../lib/utils";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <>
      <Helmet>
        <title>{buildTitle("Not Found (404)")}</title>
      </Helmet>

      <PageCenteredPaper>
        <Title order={1}>Not Found (404)</Title>

        <Alert color="red" mt="md">
          We couldn't find the resource you requested. Maybe you can find what
          you were looking for by visiting the{" "}
          <Anchor component={Link} to="/">
            home page
          </Anchor>
          .
        </Alert>
      </PageCenteredPaper>
    </>
  );
}

export default NotFound;
