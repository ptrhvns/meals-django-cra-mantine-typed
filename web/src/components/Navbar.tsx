import { Anchor, Container, Grid, Paper, Text } from "@mantine/core";
import { faUtensils } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <Paper py="md" shadow="xs">
      <Container>
        <Grid align="center" justify="space-between">
          <Text
            component={Link}
            size="xl"
            sx={(theme) => ({ color: theme.colors.blue[6] })}
            to="/"
            weight={700}
          >
            <FontAwesomeIcon icon={faUtensils} /> Meals
          </Text>
          <Anchor component={Link} to="/login">
            Login
          </Anchor>
        </Grid>
      </Container>
    </Paper>
  );
}

export default Navbar;
