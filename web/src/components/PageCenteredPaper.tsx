import React from "react";
import { Box, Center, createStyles, Paper, Text } from "@mantine/core";
import { faUtensils } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
  siteLink: {
    color: theme.colors.gray[7],
    display: "inline-block",
    textAlign: "center",
    width: "100%",

    "&:hover": {
      color: theme.colors.gray[9],
    },
  },
}));

export interface PageCenteredPaperProps {
  children: React.ReactNode;
}

function PageCenteredPaper({ children }: PageCenteredPaperProps) {
  const { classes } = useStyles();

  return (
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
          {children}
        </Paper>
      </Box>
    </Center>
  );
}

export default PageCenteredPaper;
