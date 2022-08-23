import { Anchor, Container, createStyles, Header, Text } from "@mantine/core";
import { faUtensils } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

const useStyles = createStyles((theme) => ({
  content: {
    alignItems: "center",
    display: "flex",
    height: "50px",
    justifyContent: "space-between",
  },
  logo: {
    color: theme.colors.blue[6],

    "&:hover": {
      color: theme.colors.blue[8],
    },
  },
}));

function Navbar() {
  const { classes } = useStyles();

  return (
    <Header height={50}>
      <Container>
        <div className={classes.content}>
          <Text
            className={classes.logo}
            component={Link}
            size="xl"
            to="/"
            weight={700}
          >
            <FontAwesomeIcon icon={faUtensils} /> Meals
          </Text>

          <Anchor component={Link} to="/login">
            Login
          </Anchor>
        </div>
      </Container>
    </Header>
  );
}

export default Navbar;
