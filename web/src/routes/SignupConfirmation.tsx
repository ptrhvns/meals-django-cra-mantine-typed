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
import { buildTitle } from "../lib/utils/dom";
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

function SignupConfirmation() {
  const [isConfirming, setIsConfirming] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [message, setMessage] = useState<string | undefined>(undefined);
  const params = useParams();
  const shouldConfirm = useRef<boolean>(true);
  const { classes } = useStyles();
  const { post } = useApi();

  useEffect(() => {
    if (shouldConfirm.current) {
      (async () => {
        shouldConfirm.current = false;

        const response: ApiResponse = await post({
          data: { token: params.token },
          route: "signupConfirmation",
        });

        if (response.isError) {
          setIsError(true);
          setMessage(
            join(compact([response.message, head(response.errors?.token)]), " ")
          );
        } else {
          setMessage(response.message);
        }

        setIsConfirming(false);
      })();
    }
  }, [params, post]);

  return (
    <RequireGuest>
      <Helmet>
        <title>{buildTitle("Sign Up Confirmation")}</title>
      </Helmet>

      <PageCenteredPaper>
        <Title order={1}>Sign Up Confirmation</Title>

        {isConfirming ? (
          <Alert color="gray" mt="xl">
            <Box className={classes.confirmingContent}>
              <Loader color="gray" size="sm" />
              <Text align="center">Confirming your signup ...</Text>
            </Box>
          </Alert>
        ) : (
          <Alert
            color={isError ? "red" : "green"}
            icon={
              isError ? (
                <FontAwesomeIcon icon={faCircleExclamation} />
              ) : (
                <FontAwesomeIcon icon={faCircleCheck} />
              )
            }
            mt="xl"
          >
            <Box mr="xl">
              {message}{" "}
              {isError ? (
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

export default SignupConfirmation;
