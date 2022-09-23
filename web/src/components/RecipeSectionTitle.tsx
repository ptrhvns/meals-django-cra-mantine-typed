import { createStyles, Title } from "@mantine/core";

interface RecipeSectionTitleProps {
  title: string;
}

const TITLE_SIZE = "1.25rem";

const useStyles = createStyles((theme) => ({
  title: {
    color: theme.fn.darken(theme.colors.yellow[9], 0.25),
    fontSize: TITLE_SIZE,
    fontWeight: 500,
  },
}));

function RecipeSectionTitle({ title }: RecipeSectionTitleProps) {
  const { classes } = useStyles();

  return (
    <Title className={classes.title} order={3}>
      {title}
    </Title>
  );
}

export default RecipeSectionTitle;
