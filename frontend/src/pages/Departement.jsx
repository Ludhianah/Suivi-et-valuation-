import { useEffect, useState } from "react";
import {
  Table,
  Button,
  TextInput,
  Group,
  Title,
  ActionIcon,
  Modal,
  rem,
  Box,
  Flex,
  Text,
} from "@mantine/core";
import { IconEdit, IconTrash, IconPlus } from "@tabler/icons-react";
import {
  getDepartements,
  createDepartement,
  updateDepartement,
  deleteDepartement,
} from "../services/departementService";

// --- Import toast ---
import toast, { Toaster } from "react-hot-toast";

const Departement = () => {
  const [departements, setDepartements] = useState([]);
  const [nom, setNom] = useState("");
  const [editId, setEditId] = useState(null);
  const [opened, setOpened] = useState(false);

  // 👉 NEW : modal de confirmation suppression
  const [openedConfirmDelete, setOpenedConfirmDelete] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const fetchData = async () => {
    try {
      const data = await getDepartements();
      setDepartements(data);
    } catch (error) {
      console.error("Erreur chargement départements :", error);
      toast.error("Erreur lors du chargement des départements");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nom.trim()) return;
    try {
      if (editId) {
        await updateDepartement(editId, { nom_departement: nom });
        toast.success("Département modifié avec succès !");
      } else {
        await createDepartement({ nom_departement: nom });
        toast.success("Département ajouté avec succès !");
      }
      setNom("");
      setEditId(null);
      fetchData();
      setOpened(false);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde :", error);
      toast.error("Erreur lors de la sauvegarde du département");
    }
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setNom(item.nom_departement);
    setOpened(true);
  };

  // 👉 NEW : ouverture du modal de confirmation
  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setOpenedConfirmDelete(true);
  };

  // 👉 NEW : suppression confirmée
  const confirmDelete = async () => {
    try {
      await deleteDepartement(selectedId);
      toast.success("Département supprimé !");
      setOpenedConfirmDelete(false);
      fetchData();
    } catch (error) {
      console.error("Erreur suppression :", error);
      toast.error("Erreur lors de la suppression du département");
    }
  };

  return (
    <Box className="p-6 bg-white min-h-screen">
      {/* Toaster */}
      <Toaster position="top-right" reverseOrder={false} />

      {/* En-tête */}
      <Flex justify="space-between" align="center" mb="lg">
        <Title order={2} className="text-gray-800">
          Départements
        </Title>
        <Button
          onClick={() => {
            setEditId(null);
            setNom("");
            setOpened(true);
          }}
          leftSection={<IconPlus size={16} />}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Ajouter
        </Button>
      </Flex>

      {/* Tableau */}
      <Box className="rounded-lg shadow-sm overflow-hidden">
        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th className="font-semibold text-gray-700">Département</Table.Th>
              <Table.Th className="font-semibold text-gray-700">Créé le</Table.Th>
              <Table.Th
                className="font-semibold text-gray-700 text-center"
                style={{ textAlign: 'center', width: '120px' }}
              >
                Actions
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {departements.map((d) => (
              <Table.Tr key={d.id}>
                <Table.Td>{d.nom_departement}</Table.Td>
                <Table.Td>{new Date(d.date_creation).toLocaleDateString()}</Table.Td>
                <Table.Td style={{ textAlign: 'center', width: '120px' }}>
                  <Group gap="xs" justify="center">
                    <ActionIcon
                      variant="subtle"
                      color="blue"
                      onClick={() => handleEdit(d)}
                      className="p-0 hover:bg-blue-50 transition-colors"
                    >
                      <IconEdit style={{ width: rem(16), height: rem(16) }} />
                    </ActionIcon>
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      onClick={() => handleDeleteClick(d.id)}
                      className="hover:bg-red-100"
                    >
                      <IconTrash style={{ width: rem(16), height: rem(16) }} />
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Box>

      {/* Modal pour ajouter/modifier */}
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={editId ? "Modifier le département" : "Ajouter un département"}
        centered
        overlayProps={{ opacity: 0.55, blur: 3 }}
      >
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Nom du département"
            placeholder="Ex: Informatique"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
            className="mb-4"
          />
          <Group justify="flex-end" mt="md">
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {editId ? "Modifier" : "Ajouter"}
            </Button>
          </Group>
        </form>
      </Modal>

      {/* NEW — Modal de confirmation suppression */}
      <Modal
        opened={openedConfirmDelete}
        onClose={() => setOpenedConfirmDelete(false)}
        title="Confirmer la suppression"
        centered
      >
        <Text size="sm" mb="md">
          Voulez-vous vraiment supprimer ce département ?
        </Text>

        <Group justify="flex-end">
          <Button variant="default" onClick={() => setOpenedConfirmDelete(false)}>
            Annuler
          </Button>
          <Button color="red" onClick={confirmDelete}>
            Supprimer
          </Button>
        </Group>
      </Modal>
    </Box>
  );
};

export default Departement;
