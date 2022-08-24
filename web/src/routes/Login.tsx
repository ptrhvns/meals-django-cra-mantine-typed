import LoginForm from "../components/LoginForm";
import PageCenteredPaper from "../components/PageCenteredPaper";
import RequireGuest from "../components/RequireGuest";
import { Anchor, Divider, Text, Title } from "@mantine/core";
import { buildTitle } from "../lib/utils/dom";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

function Login() {
  return (
    <RequireGuest>
      <Helmet>
        <title>{buildTitle("Log In")}</title>
      </Helmet>

      <PageCenteredPaper>
        <Title order={1}>Log In</Title>

        <LoginForm />

        <Divider my="xl" />

        <Text color="dimmed" mt="xl">
          Don't have an account?{" "}
          <Anchor component={Link} to="/signup">
            Sign up
          </Anchor>
          .
        </Text>
      </PageCenteredPaper>
    </RequireGuest>
  );
}

export default Login;
