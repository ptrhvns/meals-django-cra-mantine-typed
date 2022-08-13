import {
  Alert,
  Box,
  Button,
  createStyles,
  LoadingOverlay,
  PasswordInput,
  Text,
  TextInput,
} from "@mantine/core";
import { ApiResponse, useApi } from "../hooks/useApi";
import {
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
  const navigate = useNavigate();
  const { classes } = useStyles();
  const { post } = useApi();

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      username: "",
    },
  });

  return (
    <Box className={classes.wrapper}>
      <LoadingOverlay visible={isSubmitting} />

      <form
        className={classes.form}
        onSubmit={form.onSubmit(async (values) => {
          setIsSubmitting(true);

          const response: ApiResponse = await post({
            data: pick(values, ["email", "password", "username"]),
            route: "signup",
          });

          setIsSubmitting(false);

          if (response.isError) {
            setAlert(response.message);

            forOwn(response.errors, (value, key) =>
              form.setFieldError(key, head(value))
            );

            return;
          }

          navigate("/login", { replace: true });
        })}
      >
        {alert && (
          <Alert
            color="red"
            icon={<FontAwesomeIcon icon={faCircleExclamation} />}
            onClose={() => setAlert(undefined)}
            withCloseButton
          >
            {alert}
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
          By signing up, you agree to our Terms and Conditions and Privacy
          Policy.
        </Text>

        <Button disabled={isSubmitting} mt="xl" type="submit">
          <FontAwesomeIcon icon={faPlusCircle} />
          <Text ml="xs">Sign up</Text>
        </Button>
      </form>
    </Box>
  );
}

export default SignupForm;
