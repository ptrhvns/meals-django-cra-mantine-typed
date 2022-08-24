import Navbar from "../components/Navbar";
import RecipeList from "../components/RecipeList";
import { buildTitle } from "../lib/utils/dom";
import { Container } from "@mantine/core";
import { Helmet } from "react-helmet-async";

function Dashboard() {
  return (
    <>
      <Helmet>
        <title>{buildTitle("Dashboard")}</title>
      </Helmet>

      <Navbar />

      <Container py="md">
        <RecipeList />
      </Container>
    </>
  );
}

export default Dashboard;
