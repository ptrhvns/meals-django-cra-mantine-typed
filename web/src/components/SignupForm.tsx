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
import { forOwn, head, pick } from "lodash";
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

function SignupForm() {
  const [alert, setAlert] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<string | undefined>(undefined);
  const navigate = useNavigate();
  const { classes } = useStyles();
  const { getRouteFn, post } = useApi();

  const form = useForm({
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
        <LoadingOverlay visible={isSubmitting} />

        <form
          className={classes.form}
          onSubmit={form.onSubmit(async (values) => {
            setIsSubmitting(true);

            const response: ApiResponse = await post({
              data: pick(values, ["email", "password", "username"]),
              url: getRouteFn("signup")(),
            });

            setIsSubmitting(false);

            if (response.isError) {
              setAlert(response.message);

              forOwn(response.errors, (value, key) =>
                form.setFieldError(key, head(value))
              );

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
            disabled={isSubmitting}
            label="Username"
            mt="md"
            {...form.getInputProps("username")}
          />

          <TextInput
            disabled={isSubmitting}
            label="Email"
            mt="md"
            type="email"
            {...form.getInputProps("email")}
          />

          <PasswordInput
            disabled={isSubmitting}
            label="Password"
            mt="md"
            {...form.getInputProps("password")}
          />

          <Text className={classes.termsNotice} mt="xl" size="sm">
            By signing up for an account, you agree to our Terms and Conditions
            and Privacy Policy.
          </Text>

          <Button disabled={isSubmitting} mt="xl" type="submit">
            <FontAwesomeIcon icon={faPlusCircle} />
            <Text ml="xs">Sign up</Text>
          </Button>
        </form>
      </Box>
    </>
  );
}

export default SignupForm;
