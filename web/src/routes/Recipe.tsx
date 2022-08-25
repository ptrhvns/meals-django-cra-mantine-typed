import Navbar from "../components/Navbar";
import RequireAuthn from "../components/RequireAuthn";
import { Alert, Box, Button, Container, Modal, Text } from "@mantine/core";
import { buildTitle } from "../lib/utils/dom";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Helmet } from "react-helmet-async";
import { useApi } from "../hooks/useApi";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useState } from "react";

function Recipe() {
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  const [confirmDeleteAlert, setConfirmDeleteAlert] = useState<
    string | undefined
  >(undefined);
  const navigate = useNavigate();
  const { getRouteFn, post } = useApi();
  const { recipeId } = useParams() as { recipeId: string };

  return (
    <RequireAuthn>
      <Helmet>
        <title>{buildTitle("Recipe")}</title>
      </Helmet>

      <Navbar />

      <Modal
        centered={true}
        onClose={() => setConfirmDelete(false)}
        opened={confirmDelete}
        padding="sm"
        title="Delete Recipe"
      >
        <Text component="p">Are you sure you want to delete this recipe?</Text>

        {confirmDeleteAlert && (
          <Alert
            color="red"
            icon={<FontAwesomeIcon icon={faCircleExclamation} />}
            mb="lg"
            onClose={() => setConfirmDeleteAlert(undefined)}
            withCloseButton
          >
            <Box mr="xl">{confirmDeleteAlert}</Box>
          </Alert>
        )}

        <Button
          color="red"
          onClick={async () => {
            const response = await post({
              url: getRouteFn("recipeDestroy")({ recipeId }),
            });

            if (response.isError) {
              setConfirmDeleteAlert(response.message);
              return;
            }

            navigate("/dashboard", { replace: true });
          }}
        >
          Delete recipe
        </Button>
      </Modal>

      <Container>
        <Box mt="xl">
          <Button color="red" onClick={() => setConfirmDelete(true)}>
            Delete recipe
          </Button>
        </Box>
      </Container>
    </RequireAuthn>
  );
}

export default Recipe;
