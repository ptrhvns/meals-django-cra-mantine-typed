import Navbar from "../components/Navbar";
import RequireGuest from "../components/RequireGuest";
import {
  Box,
  Button,
  Center,
  Container,
  createStyles,
  Text,
  Title,
} from "@mantine/core";
import { buildTitle } from "../lib/utils";
import { faUtensils } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const useStyles = createStyles((theme) => ({
  heroButton: {
    boxShadow: theme.shadows.sm,
    fontSize: theme.fontSizes.md,
    width: "13rem",
  },
  heroContent: {
    textAlign: "center",
  },
  heroSubheader: {
    color: theme.colors.gray[7],
  },
  heroTitle: {
    color: theme.colors.blue[6],
    fontSize: "2.25rem",
    fontWeight: 600,
  },
  heroWrapper: {
    height: "clamp(20rem, 60vh, 40rem)",
  },
}));

export default function Home() {
  const { classes } = useStyles();

  return (
    <RequireGuest>
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
              <FontAwesomeIcon icon={faUtensils} />
              <Text ml="xs">Sign up</Text>
            </Button>
          </Box>
        </Center>
      </Container>
    </RequireGuest>
  );
}
