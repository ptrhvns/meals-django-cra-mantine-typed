import SignupForm from "../components/SignupForm";
import {
  Anchor,
  Box,
  Center,
  createStyles,
  Divider,
  Paper,
  Text,
  Title,
} from "@mantine/core";
import { buildTitle } from "../lib/utils/dom";
import { faUtensils } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const useStyles = createStyles((theme) => ({
  pageContent: {
    maxWidth: "30rem",
    width: "100%",
  },
  pageContentWrapper: {
    backgroundColor: theme.colors.gray[1],
    minHeight: "100vh",
  },
  subHeader: {
    color: theme.colors.gray[7],
  },
  siteLink: {
    color: theme.colors.gray[7],
    display: "inline-block",
    textAlign: "center",
    width: "100%",

    "&:hover": {
      color: theme.colors.gray[9],
    },
  },
  title: {
    color: theme.colors.blue[6],
  },
  loginLink: {
    color: theme.colors.gray[7],
  },
}));

function Signup() {
  const { classes } = useStyles();

  return (
    <>
      <Helmet>
        <title>{buildTitle("Sign up")}</title>
      </Helmet>

      <Center className={classes.pageContentWrapper} py="md">
        <Box className={classes.pageContent}>
          <Text
            className={classes.siteLink}
            component={Link}
            size="xl"
            to="/"
            weight={700}
          >
            <FontAwesomeIcon icon={faUtensils} /> Meals
          </Text>

          <Paper m="md" px="sm" pt="xs" pb="xl" shadow="md">
            <Title className={classes.title} order={1}>
              Sign up
            </Title>

            <Text className={classes.subHeader} mt="xs">
              Make meals easy, and save time.
            </Text>

            <SignupForm />

            <Divider my="xl" />

            <Text className={classes.loginLink} mt="xl">
              Already have an account?{" "}
              <Anchor component={Link} to="/login">
                Log in
              </Anchor>
              .
            </Text>
          </Paper>
        </Box>
      </Center>
    </>
  );
}

export default Signup;
