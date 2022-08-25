import useAuthn from "../hooks/useAuthn";
import {
  Alert,
  Anchor,
  Container,
  createStyles,
  Header,
  Menu,
  Modal,
  Text,
} from "@mantine/core";
import {
  faBars,
  faCircleExclamation,
  faUtensils,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import { useState } from "react";

const useStyles = createStyles((theme) => ({
  content: {
    alignItems: "center",
    display: "flex",
    height: "55px",
    justifyContent: "space-between",
  },
  logo: {
    color: theme.colors[theme.primaryColor][theme.fn.primaryShade()],

    "&:hover": {
      color: theme.colors[theme.primaryColor][theme.fn.primaryShade() + 2],
    },
  },
  menuTarget: {
    borderRadius: theme.radius.sm,
    color: theme.colors.gray[7],
    fontSize: theme.fontSizes.md,
    fontWeight: 500,
    padding: "0.25rem 0.5rem",

    "&:hover": {
      backgroundColor: theme.colors.gray[0],
    },
  },
}));

function Navbar() {
  const [error, setError] = useState<string | undefined>(undefined);
  const authn = useAuthn();
  const { classes } = useStyles();
  const { getRouteFn, post } = useApi();

  return (
    <>
      <Modal
        centered={true}
        onClose={() => setError(undefined)}
        opened={!!error}
        padding="sm"
        title="Menu Error"
      >
        <Alert
          color="red"
          icon={<FontAwesomeIcon icon={faCircleExclamation} />}
        >
          {error}
        </Alert>
      </Modal>

      <Header height={55}>
        <Container>
          <div className={classes.content}>
            <Text
              className={classes.logo}
              component={Link}
              size={22}
              to="/"
              weight={700}
            >
              <FontAwesomeIcon icon={faUtensils} /> Meals
            </Text>

            {authn.isAuthenticated ? (
              <Menu
                closeOnClickOutside
                exitTransitionDuration={0}
                transitionDuration={0}
                trigger="click"
              >
                <Menu.Target>
                  <span className={classes.menuTarget}>
                    <FontAwesomeIcon icon={faBars} /> Menu
                  </span>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Item
                    onClick={async () => {
                      const response = await post({
                        url: getRouteFn("logout")(),
                      });

                      if (response.isError) {
                        setError(response.message || "Log out failed.");
                        return;
                      }

                      authn.logout();
                    }}
                  >
                    Log out
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            ) : (
              <Anchor component={Link} to="/login">
                Login
              </Anchor>
            )}
          </div>
        </Container>
      </Header>
    </>
  );
}

export default Navbar;
