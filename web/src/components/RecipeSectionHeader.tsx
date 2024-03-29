import { Box, createStyles } from "@mantine/core";
import { ReactNode } from "react";

interface RecipeSectionHeaderProps {
  children: ReactNode;
}

const useStyles = createStyles(() => ({
  titleWrapper: {
    display: "flex",
    justifyContent: "space-between",
  },
}));

export default function RecipeSectionHeader({ children }: RecipeSectionHeaderProps) {
  const { classes } = useStyles();

  return <Box className={classes.titleWrapper}>{children}</Box>;
}
