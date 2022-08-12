import Navbar from "../components/Navbar";
import { Box, Button, Center, Container, Text, Title } from "@mantine/core";
import { buildTitle } from "../lib/utils/dom";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

function Home() {
  return (
    <>
      <Helmet>
        <title>{buildTitle("Home")}</title>
      </Helmet>
      <Navbar />
      <Container>
        <Center sx={{ height: "clamp(20rem, 60vh, 40rem)" }}>
          <Box sx={{ textAlign: "center" }}>
            <Title order={1} sx={(theme) => ({ color: theme.colors.blue[6] })}>
              Meals made easy.
            </Title>
            <Text
              mt="xs"
              sx={(theme) => ({
                color: theme.fn.lighten(theme.colors.gray[7], 0.2),
              })}
            >
              Manage recipes, menus, shopping lists, grocery stores, and much
              more.
            </Text>
            <Button
              component={Link}
              mt="xl"
              sx={(theme) => ({ fontSize: theme.fontSizes.md, width: "13rem" })}
              to="/signup"
            >
              Sign up
            </Button>
          </Box>
        </Center>
      </Container>
    </>
  );
}

export default Home;
