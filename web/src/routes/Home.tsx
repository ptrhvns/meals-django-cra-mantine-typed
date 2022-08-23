import Navbar from "../components/Navbar";
import {
  Box,
  Button,
  Center,
  Container,
  createStyles,
  Text,
  Title,
} from "@mantine/core";
import { buildTitle } from "../lib/utils/dom";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const useStyles = createStyles((theme) => ({
  heroButton: { fontSize: theme.fontSizes.md, width: "13rem" },
  heroContent: { textAlign: "center" },
  heroSubheader: { color: theme.colors.gray[7] },
  heroTitle: { color: theme.colors.blue[6] },
  heroWrapper: { height: "clamp(20rem, 60vh, 40rem)" },
}));

function Home() {
  const { classes } = useStyles();

  return (
    <>
      <Helmet>
        <title>{buildTitle("Home")}</title>
      </Helmet>

      <Navbar />

      <Container>
        <Center className={classes.heroWrapper}>
          <Box className={classes.heroContent}>
            <Title className={classes.heroTitle} order={1}>
              Meals made easy.
            </Title>

            <Text className={classes.heroSubheader} mt="xs" size="lg">
              Manage recipes, menus, shopping lists, and much more.
            </Text>

            <Button
              className={classes.heroButton}
              component={Link}
              mt="xl"
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
