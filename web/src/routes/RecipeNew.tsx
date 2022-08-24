import PageCenteredPaper from "../components/PageCenteredPaper";
import RecipeForm from "../components/RecipeForm";
import RequireAuthn from "../components/RequireAuthn";
import { Anchor, Divider, Title, Text } from "@mantine/core";
import { buildTitle } from "../lib/utils/dom";
import { faCircleArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

function RecipeNew() {
  return (
    <RequireAuthn>
      <Helmet>
        <title>{buildTitle("New Recipe")}</title>
      </Helmet>

      <PageCenteredPaper>
        <Title order={1}>New Recipe</Title>
        <Text component="p">Start with a recipe title.</Text>
        <RecipeForm />

        <Divider my="xl" />

        <Anchor component={Link} to="/dashboard">
          <FontAwesomeIcon icon={faCircleArrowLeft} /> Go to dashboard
        </Anchor>
      </PageCenteredPaper>
    </RequireAuthn>
  );
}

export default RecipeNew;
