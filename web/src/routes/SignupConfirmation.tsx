import PageCenteredPaper from "../components/PageCenteredPaper";
import RequireGuest from "../components/RequireGuest";
import {
  Alert,
  Anchor,
  Box,
  createStyles,
  Loader,
  Text,
  Title,
} from "@mantine/core";
import { ApiResponse, useApi } from "../hooks/useApi";
import { buildTitle } from "../lib/utils";
import { compact, head, join } from "lodash";
import {
  faCircleCheck,
  faCircleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

const useStyles = createStyles((_theme) => ({
  confirmingContent: {
    textAlign: "center",
  },
}));

export default function SignupConfirmation() {
  const [confirming, setConfirming] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [message, setMessage] = useState<string | undefined>(undefined);
  const params = useParams();
  const shouldConfirm = useRef<boolean>(true);
  const { classes } = useStyles();
  const { getRouteFn, post } = useApi();

  useEffect(() => {
    if (shouldConfirm.current) {
      (async () => {
        shouldConfirm.current = false;

        const response: ApiResponse = await post({
          data: { token: params.token },
          url: getRouteFn("signupConfirmation")(),
        });

        if (response.isError) {
          setError(true);
          setMessage(
            join(compact([response.message, head(response.errors?.token)]), " ")
          );
        } else {
          setMessage(response.message);
        }

        setConfirming(false);
      })();
    }
  }, [getRouteFn, params, post]);

  return (
    <RequireGuest>
      <Helmet>
        <title>{buildTitle("Sign Up Confirmation")}</title>
      </Helmet>

      <PageCenteredPaper>
        <Title order={1}>Sign Up Confirmation</Title>

        {confirming ? (
          <Alert color="gray" mt="xl">
            <Box className={classes.confirmingContent}>
              <Loader color="gray" size="sm" />
              <Text align="center">Confirming your signup ...</Text>
            </Box>
          </Alert>
        ) : (
          <Alert
            color={error ? "red" : "green"}
            icon={
              error ? (
                <FontAwesomeIcon icon={faCircleExclamation} />
              ) : (
                <FontAwesomeIcon icon={faCircleCheck} />
              )
            }
            mt="xl"
          >
            <Box mr="xl">
              {message}{" "}
              {error ? (
                <>
                  Please double check the address you visited to make sure it's
                  correct, or you can try{" "}
                  <Anchor component={Link} to="/signup">
                    signing up
                  </Anchor>{" "}
                  for an account.
                </>
              ) : (
                <>
                  You may now use the username and password you previously
                  created to{" "}
                  <Anchor component={Link} to="/login">
                    log in
                  </Anchor>{" "}
                  to your new account.
                </>
              )}
            </Box>
          </Alert>
        )}
      </PageCenteredPaper>
    </RequireGuest>
  );
}
