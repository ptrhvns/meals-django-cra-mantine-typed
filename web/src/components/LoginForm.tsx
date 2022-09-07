import useAuthn from "../hooks/useAuthn";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  createStyles,
  LoadingOverlay,
  PasswordInput,
  Text,
  TextInput,
} from "@mantine/core";
import {
  faCircleExclamation,
  faSignInAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { handledApiError } from "../lib/utils/api";
import { pick } from "lodash";
import { useApi } from "../hooks/useApi";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const useStyles = createStyles(() => ({
  wrapper: {
    position: "relative",
  },
}));

function LoginForm() {
  const [alert, setAlert] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const authn = useAuthn();
  const navigate = useNavigate();
  const { classes } = useStyles();
  const { getRouteFn, post } = useApi();

  const { getInputProps, onSubmit, setFieldError } = useForm({
    initialValues: {
      password: "",
      remember_me: "",
      username: "",
    },
  });

  return (
    <Box className={classes.wrapper}>
      <LoadingOverlay visible={isSubmitting} />

      <form
        onSubmit={onSubmit(async (values) => {
          setIsSubmitting(true);

          const response = await post({
            data: pick(values, ["password", "remember_me", "username"]),
            url: getRouteFn("login")(),
          });

          setIsSubmitting(false);

          if (handledApiError(response, { setAlert, setFieldError })) {
            return;
          }

          authn.login(() => navigate("/dashboard", { replace: true }));
        })}
      >
        {alert && (
          <Alert
            color="red"
            icon={<FontAwesomeIcon icon={faCircleExclamation} />}
            onClose={() => setAlert(undefined)}
            withCloseButton
          >
            <Box mr="xl">{alert}</Box>
          </Alert>
        )}

        <TextInput
          disabled={isSubmitting}
          label="Username"
          mt="md"
          {...getInputProps("username")}
        />

        <PasswordInput
          disabled={isSubmitting}
          label="Password"
          mt="md"
          {...getInputProps("password")}
        />

        <Checkbox
          checked
          label="Remember me"
          mt="md"
          {...getInputProps("remember_me")}
        />

        <Button disabled={isSubmitting} mt="xl" type="submit">
          <FontAwesomeIcon icon={faSignInAlt} />
          <Text ml="xs">Log in</Text>
        </Button>
      </form>
    </Box>
  );
}

export default LoginForm;
