import {
  Alert,
  Box,
  Button,
  createStyles,
  LoadingOverlay,
  Text,
  TextInput,
} from "@mantine/core";
import {
  faCircleExclamation,
  faCirclePlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { forOwn, head, pick } from "lodash";
import { useApi } from "../hooks/useApi";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const useStyles = createStyles(() => ({
  actions: {
    display: "flex",
    flexWrap: "wrap",
    gap: "1rem",
    justifyContent: "space-between",
  },
  wrapper: {
    position: "relative",
  },
}));

function RecipeForm() {
  const [alert, setAlert] = useState<string | undefined>(undefined);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();
  const { classes } = useStyles();
  const { getRouteFn, post } = useApi();

  const form = useForm({
    initialValues: {
      title: "",
    },
  });

  return (
    <Box className={classes.wrapper}>
      <LoadingOverlay visible={submitting} />

      <form
        onSubmit={form.onSubmit(async (values) => {
          setSubmitting(true);

          const response = await post({
            data: pick(values, ["title"]),
            url: getRouteFn("recipeCreate")(),
          });

          setSubmitting(false);

          if (response.isError) {
            setAlert(response.message);

            forOwn(response.errors, (value, key) =>
              form.setFieldError(key, head(value))
            );

            return;
          }

          navigate(`/recipe/${response.data.id}`, { replace: true });
        })}
      >
        {alert && (
          <Alert
            color="red"
            icon={<FontAwesomeIcon icon={faCircleExclamation} />}
            mt="md"
            onClose={() => setAlert(undefined)}
            withCloseButton
          >
            <Box mr="xl">{alert}</Box>
          </Alert>
        )}

        <TextInput
          disabled={submitting}
          label="Title"
          mt="md"
          {...form.getInputProps("title")}
        />

        <Box className={classes.actions} mt="xl">
          <Button disabled={submitting} type="submit">
            <FontAwesomeIcon icon={faCirclePlus} />
            <Text ml="xs">Save and continue</Text>
          </Button>

          <Button
            color="gray"
            disabled={submitting}
            onClick={() => navigate("/dashboard")}
            variant="outline"
          >
            <Text>Dismiss</Text>
          </Button>
        </Box>
      </form>
    </Box>
  );
}

export default RecipeForm;
