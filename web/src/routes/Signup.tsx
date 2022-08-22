import PageCenteredPaper from "../components/PageCenteredPaper";
import SignupForm from "../components/SignupForm";
import { Anchor, createStyles, Divider, Text, Title } from "@mantine/core";
import Subheader from "../components/Subheader";
import { buildTitle } from "../lib/utils/dom";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

function Signup() {
  return (
    <>
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
    </>
  );
}

export default Signup;
