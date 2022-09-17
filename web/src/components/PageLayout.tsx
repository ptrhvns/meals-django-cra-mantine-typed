import { Box, Container, createStyles } from "@mantine/core";
import { navbarHeight } from "../components/Navbar";
import { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
  containerClassName?: string;
}

const useStyles = createStyles((theme) => ({
  background: {
    backgroundColor: theme.colors.gray[1],
    minHeight: `calc(100vh - ${navbarHeight}px)`,
  },
  content: {
    backgroundColor: "white",
    borderRadius: 6,
    boxShadow: theme.shadows.md,
  },
}));

function PageLayout({ children, containerClassName }: PageLayoutProps) {
  const { classes, cx } = useStyles();

  return (
    <Box className={classes.background} p="sm">
      <Container className={cx(classes.content, containerClassName)} py="md">
        {children}
      </Container>
    </Box>
  );
}

export default PageLayout;
