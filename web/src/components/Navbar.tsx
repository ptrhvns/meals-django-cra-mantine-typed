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
import { handledApiError } from "../lib/utils";
import { Link } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import { useState } from "react";

export const navbarHeight = 55;

const useStyles = createStyles((theme) => ({
  content: {
    alignItems: "center",
    display: "flex",
    height: navbarHeight,
    justifyContent: "space-between",
  },
  header: {
    boxShadow: theme.shadows.md,
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

      <Header className={classes.header} height={navbarHeight}>
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

            {authn.authenticated ? (
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

                      if (
                        handledApiError(response, {
                          defaultAlert: "Log out failed.",
                          setAlert: setError,
                        })
                      ) {
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
