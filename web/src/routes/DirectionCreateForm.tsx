import Navbar from "../components/Navbar";
import RequireAuthn from "../components/RequireAuthn";
import { buildTitle } from "../lib/utils";
import { Helmet } from "react-helmet-async";

export default function DirectionCreateForm() {
  return (
    <RequireAuthn>
      <Helmet>
        <title>{buildTitle("New Direction")}</title>
      </Helmet>

      <Navbar />
    </RequireAuthn>
  );
}
