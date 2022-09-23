import { Box, createStyles } from "@mantine/core";
import { ReactNode } from "react";

interface RecipeSectionProps {
  children: ReactNode;
}

const useStyles = createStyles((theme) => ({
  wrapper: {
    backgroundColor: theme.fn.lighten(theme.colors.gray[1], 0.5),
    border: `1px solid ${theme.colors.gray[2]}`,
    borderRadius: theme.radius.sm,
  },
}));

function RecipeSection({ children }: RecipeSectionProps) {
  const { classes } = useStyles();

  return (
    <Box className={classes.wrapper} mt="1rem" pb="md" pt="0.5rem" px="xs">
      {children}
    </Box>
  );
}

export default RecipeSection;
