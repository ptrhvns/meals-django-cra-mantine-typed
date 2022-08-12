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
import {
  faCircleExclamation,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from "@mantine/form";
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
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { classes } = useStyles();

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

          console.log("DEBUG values", values); // TODO remove

          // TODO remove
          setTimeout(() => {
            setIsSubmitting(false);
            setAlertMessage("Form submission is not implemented yet.");
          }, 1000);
        })}
      >
        {alertMessage && (
          <Alert
            color="red"
            icon={<FontAwesomeIcon icon={faCircleExclamation} />}
          >
            {alertMessage}
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
          By signing up, you agree to this site's Terms and Conditions and
          Privacy Policy.
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
