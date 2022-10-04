import PageCenteredPaper from "../components/PageCenteredPaper";
import RequireGuest from "../components/RequireGuest";
import SignupForm from "../components/SignupForm";
import Subheader from "../components/Subheader";
import { Anchor, Divider, Text, Title } from "@mantine/core";
import { buildTitle } from "../lib/utils";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

export default function Signup() {
  return (
    <RequireGuest>
      <Helmet>
        <title>{buildTitle("Sign Up")}</title>
      </Helmet>

      <PageCenteredPaper>
        <Title order={1}>Sign Up</Title>

        <Subheader mt="xs">Make meals easy, and save time.</Subheader>

        <SignupForm />

        <Divider my="xl" />

        <Text color="dimmed" mt="xl">
          Already have an account?{" "}
          <Anchor component={Link} to="/login">
            Log in
          </Anchor>
          .
        </Text>
      </PageCenteredPaper>
    </RequireGuest>
  );
}
