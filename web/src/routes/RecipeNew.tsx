import Navbar from "../components/Navbar";
import PageLayout from "../components/PageLayout";
import RecipeForm from "../components/RecipeForm";
import RequireAuthn from "../components/RequireAuthn";
import { Anchor, Breadcrumbs, createStyles, Title, Text } from "@mantine/core";
import { buildTitle } from "../lib/utils";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const useStyles = createStyles(() => ({
  pageLayout: {
    maxWidth: "35rem",
  },
}));

function RecipeNew() {
  const { classes } = useStyles();

  return (
    <RequireAuthn>
      <Helmet>
        <title>{buildTitle("New Recipe")}</title>
      </Helmet>

      <Navbar />

      <PageLayout containerClassName={classes.pageLayout}>
        <Breadcrumbs>
          <Anchor component={Link} to="/dashboard">
            Dashboard
          </Anchor>

          <Anchor component={Link} to="/recipe/new">
            New Recipe
          </Anchor>
        </Breadcrumbs>

        <Title order={1} mt="md">
          New Recipe
        </Title>

        <Text component="p">Start with a recipe title.</Text>

        <RecipeForm />
      </PageLayout>
    </RequireAuthn>
  );
}

export default RecipeNew;
