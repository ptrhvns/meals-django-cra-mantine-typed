import SignupForm from "../components/SignupForm";
import { Box, Center, createStyles, Paper, Text, Title } from "@mantine/core";
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
    height: "100vh",
  },
  subHeader: {
    color: theme.colors.gray[7],
  },
  siteLink: {
    color: theme.colors.gray[7],
    display: "inline-block",
    textAlign: "center",
    width: "100%",
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

      <Center className={classes.pageContentWrapper}>
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

            <Text className={classes.loginLink} mt="xl">
              Already have an account? <Link to="/login">Log in</Link>.
            </Text>
          </Paper>
        </Box>
      </Center>
    </>
  );
}

export default Signup;
