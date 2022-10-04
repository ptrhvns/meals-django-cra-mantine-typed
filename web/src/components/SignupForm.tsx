import {
  Alert,
  Box,
  Button,
  createStyles,
  LoadingOverlay,
  Modal,
  PasswordInput,
  Text,
  TextInput,
} from "@mantine/core";
import { ApiResponse, useApi } from "../hooks/useApi";
import {
  faCircleCheck,
  faCircleExclamation,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { handledApiError } from "../lib/utils";
import { pick } from "lodash";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const useStyles = createStyles((theme) => ({
  alert: {
    marginTop: theme.spacing.md,
  },
  form: {
    marginTop: theme.spacing.md,
  },
  termsNotice: {
    color: theme.colors.gray[7],
  },
  wrapper: {
    position: "relative",
  },
}));

export default function SignupForm() {
  const [alert, setAlert] = useState<string | undefined>(undefined);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<string | undefined>(undefined);
  const navigate = useNavigate();
  const { classes } = useStyles();
  const { getRouteFn, post } = useApi();

  const { getInputProps, onSubmit, setFieldError } = useForm({
    initialValues: {
      email: "",
      password: "",
      username: "",
    },
  });

  return (
    <>
      <Modal
        centered={true}
        onClose={() => navigate("/login", { replace: true })}
        opened={!!success}
        padding="sm"
        title="Sign up"
      >
        <Alert color="green" icon={<FontAwesomeIcon icon={faCircleCheck} />}>
          {success}
        </Alert>
      </Modal>

      <Box className={classes.wrapper}>
        <LoadingOverlay visible={submitting} />

        <form
          className={classes.form}
          onSubmit={onSubmit(async (values) => {
            setSubmitting(true);

            const response: ApiResponse = await post({
              data: pick(values, ["email", "password", "username"]),
              url: getRouteFn("signup")(),
            });

            setSubmitting(false);

            if (handledApiError(response, { setAlert, setFieldError })) {
              return;
            }

            setSuccess(response.message);
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
            disabled={submitting}
            label="Username"
            mt="md"
            {...getInputProps("username")}
          />

          <TextInput
            disabled={submitting}
            label="Email"
            mt="md"
            type="email"
            {...getInputProps("email")}
          />

          <PasswordInput
            disabled={submitting}
            label="Password"
            mt="md"
            {...getInputProps("password")}
          />

          <Text className={classes.termsNotice} mt="xl" size="sm">
            By signing up for an account, you agree to our Terms and Conditions
            and Privacy Policy.
          </Text>

          <Button disabled={submitting} mt="xl" type="submit">
            <FontAwesomeIcon icon={faPlusCircle} />
            <Text ml="xs">Sign up</Text>
          </Button>
        </form>
      </Box>
    </>
  );
}
