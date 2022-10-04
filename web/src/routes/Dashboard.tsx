import Navbar from "../components/Navbar";
import PageLayout from "../components/PageLayout";
import RecipeList from "../components/RecipeList";
import RequireAuthn from "../components/RequireAuthn";
import { buildTitle } from "../lib/utils";
import { Helmet } from "react-helmet-async";

export default function Dashboard() {
  return (
    <RequireAuthn>
      <Helmet>
        <title>{buildTitle("Dashboard")}</title>
      </Helmet>

      <Navbar />

      <PageLayout>
        <RecipeList />
      </PageLayout>
    </RequireAuthn>
  );
}
